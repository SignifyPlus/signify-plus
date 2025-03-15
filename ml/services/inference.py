import asyncio
import json
import cv2
import numpy as np
from base64 import b64decode
import tensorflow as tf
from typing import List, Dict, Any
import mediapipe as mp
import dotenv
import os
from fastapi import WebSocket

dotenv.load_dotenv()

class KerasInferenceService:
    def __init__(self, model_path=None):
        """
        Initialize the Keras inference service
        model_path: Path to your Keras model file
        """
        self.model_path = model_path or os.environ.get('ML_MODEL_PATH', './models/model.keras')
        self.sequence_length = int(os.environ.get('ML_SEQUENCE_LENGTH', 30))
        self.confidence_threshold = float(os.environ.get('ML_CONFIDENCE_THRESHOLD', 0.95))
        
        self.sequence_buffer = [] 
        self.action_seq = []  
        
        # Hand state tracking
        self.no_hand_counter = 0
        self.no_hand_threshold = 3
        self.hand_present = False
        self.last_prediction = None
        
        # Active clients
        self.active_clients = set()

    async def initialize(self):
        """Initialize the service, load models and resources"""
        self.load_model()
        self.load_class_names()
        
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5   
        )
        print("ML Inference service initialized")
        return self

    async def cleanup(self):
        """Clean up resources"""
        # Release MediaPipe resources
        self.hands.close()
        return True

    def load_model(self):
        """Load the Keras model from the specified path."""
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            print(f"Loaded model from {self.model_path}")
        except Exception as e:
            print(f"Failed to load model from {self.model_path}: {e}")
            raise
    
    def load_class_names(self):
        """Load class names from a file or environment variable."""
        class_names_env = os.environ.get('ML_CLASS_NAMES')
        if class_names_env:
            self.class_names = class_names_env.split(',')
            return
            
        # Try to load from a file
        class_names_file = os.environ.get('ML_CLASS_NAMES_FILE', './config/actions.txt')
        try:
            with open(class_names_file, 'r') as f:
                self.class_names = [line.strip() for line in f.readlines()]
            print(f"Loaded {len(self.class_names)} classes from {class_names_file}")
        except Exception as e:
            print(f"Could not load class names from {class_names_file}: {e}")
            self.class_names = [
                "welcome", "we", "happy", "you", "here",
                "today", "topic", "c", "t", "i", "s"
            ]
            print("Using default class names")
    
    def extract_features(self, frame: np.ndarray) -> tuple:
        """
        Extract a 99-dimensional feature vector from the frame using MediaPipe Hands.
        Returns (features, hand_detected_flag)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        if not results.multi_hand_landmarks:
            return np.zeros(99, dtype=np.float32), False
            
        for hand_landmarks in results.multi_hand_landmarks:
            # Extract joint coordinates
            joint = np.zeros((21, 4))
            for j, lm in enumerate(hand_landmarks.landmark):
                joint[j] = [lm.x, lm.y, lm.z, lm.visibility]

            # Compute angles between joints
            v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
            v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
            v = v2 - v1
            
            # Normalize vectors
            v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

            # Calculate angles
            angle = np.arccos(np.einsum('nt,nt->n',
                v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18],:], 
                v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19],:]))
            angle = np.degrees(angle)
            
            # Concatenate joint.flatten() (84 values) and angle (15 values) to get 99 features
            d = np.concatenate([joint.flatten(), angle])
            return d, True
            
        return np.zeros(99, dtype=np.float32), False
    
    async def process_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """Process a video frame and return predictions"""
        try:
            features, hand_detected = self.extract_features(frame)
            
            # Update hand state
            if not hand_detected:
                self.no_hand_counter += 1
                if self.no_hand_counter >= self.no_hand_threshold:
                    if self.hand_present:  # State transition: hand present -> not present
                        self.hand_present = False
                        self.sequence_buffer = []  # Reset buffer on transition
                        self.last_prediction = None
                        return []  # Return empty to clear UI
                    return []  # No hand, no prediction
            else:
                self.no_hand_counter = 0
                self.hand_present = True
        
            # Add features to sequence if hand is present
            if self.hand_present:
                self.sequence_buffer.append(features)
                
                # Keep sequence at expected length
                if len(self.sequence_buffer) > self.sequence_length:
                    self.sequence_buffer = self.sequence_buffer[-self.sequence_length:]
            
                # Only make prediction if we have enough frames
                if len(self.sequence_buffer) < self.sequence_length:
                    return []
                    
                # Make prediction
                input_data = np.expand_dims(np.array(self.sequence_buffer, dtype=np.float32), axis=0)
                predictions = self.model.predict(input_data, verbose=0)[0]
                
                # Process prediction
                predicted_idx = int(np.argmax(predictions))
                confidence = float(predictions[predicted_idx])
                
                # Only return predictions with high confidence
                if confidence < self.confidence_threshold:
                    return []
                
                action = self.class_names[predicted_idx]
                self.last_prediction = action
                self.action_seq.append(action)
                
                # Only show prediction after 2 consistent predictions
                if len(self.action_seq) < 2:
                    return []
                    
                # Keep sequence from getting too long
                if len(self.action_seq) > 5:
                    self.action_seq = self.action_seq[-5:]
                    
                print(f"Prediction: {action}, confidence: {confidence:.2f}")
                return [{"gesture": action, "confidence": confidence}]
            
            return []  # Default empty response
        except Exception as e:
            print(f"Error during inference: {e}")
            return []
    
    async def handle_client(self, websocket: WebSocket):
        """Handle WebSocket client connection"""
        print("New inference client connected")
        
        try:
            # Helper function for sending responses
            async def send_response(status, data=None, error=None):
                response = {"status": status}
                if data is not None:
                    response.update(data)
                if error is not None:
                    response["message"] = str(error)
                await websocket.send_json(response)
                
            async for message in websocket.iter_json():
                try:
                    if message.get("type") == "frame":
                        jpg_data = b64decode(message["data"])
                        nparr = np.frombuffer(jpg_data, np.uint8)
                        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        
                        predictions = await self.process_frame(frame)
                        await send_response("success", {"predictions": predictions})
                except Exception as e:
                    print(f"Error processing message: {e}")
                    await send_response("error", error=str(e))
        except Exception as e:
            print(f"WebSocket connection error: {e}")