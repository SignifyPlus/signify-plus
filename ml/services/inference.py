import asyncio
import json
import cv2
import numpy as np
from base64 import b64decode
import tensorflow as tf
from typing import List, Dict, Any, Deque
import mediapipe as mp
import dotenv
import os
from fastapi import WebSocket
from collections import deque
import time

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

        # Frame interpolation parameters
        self.target_fps = int(os.environ.get('ML_TARGET_FPS', 15))
        self.max_frame_age = float(os.environ.get('ML_MAX_FRAME_AGE', 0.5))  # Maximum age of frames to keep (in seconds)

        # Time-based sliding window instead of frame count
        self.sliding_window_duration = float(os.environ.get('ML_WINDOW_DURATION', 1.0))  # Window duration in seconds

        # Enhanced buffers for time-based interpolation
        self.frame_buffer = deque(maxlen=60)  # Store more frames than needed to handle variable rate
        self.time_buffer = deque(maxlen=60)   # Corresponding timestamps
        self.feature_buffer = deque(maxlen=60)  # Store extracted features with timestamps

        # For interpolation
        self.last_interpolation_time = 0
        self.interpolation_interval = 1.0 / self.target_fps

        # Hand state tracking
        self.no_hand_counter = 0
        self.no_hand_threshold = 3
        self.hand_present = False
        self.last_prediction = None

        # Performance monitoring
        self.processing_times = deque(maxlen=100)
        self.actual_fps = 0
        
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
        print(f"Using sequence length: {self.sequence_length}")
        print(f"Target FPS: {self.target_fps}")
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
    
    def interpolate_features(self, time_point: float) -> np.ndarray:
        """
        Interpolate features at a specific time point from neighboring frames.
        Uses linear interpolation between the closest frames before and after.
        """
        if len(self.feature_buffer) < 2 or len(self.time_buffer) < 2:
            # Not enough frames to interpolate
            return np.zeros(99, dtype=np.float32)

        # Find frames that bracket the desired time point
        i = 0
        while i < len(self.time_buffer) - 1 and self.time_buffer[i+1] < time_point:
            i += 1
        if i >= len(self.time_buffer) - 1:
            # Time point is after all available frames, use the last frame
            return self.feature_buffer[i][0]  # Just return features
        if self.time_buffer[i] > time_point:
            # Time point is before all available frames, use the first frame
            return self.feature_buffer[0][0]  # Just return features
        # Get the two neighboring frames
        t0, t1 = self.time_buffer[i], self.time_buffer[i+1]
        f0, f1 = self.feature_buffer[i][0], self.feature_buffer[i+1][0]  # Get features

        # Calculate interpolation factor (0 to 1)
        if t1 == t0:  # Avoid division by zero
            alpha = 0
        else:
            alpha = (time_point - t0) / (t1 - t0)

        # Linear interpolation: f = (1-alpha)*f0 + alpha*f1
        return (1-alpha) * f0 + alpha * f1

    def generate_interpolated_sequence(self) -> List[np.ndarray]:
        """
        Generate a sequence of evenly spaced features at the target FPS.
        """
        if not self.time_buffer or not self.feature_buffer:
            return []
        # Get the time range from the buffer
        start_time = max(self.time_buffer[0], time.time() - self.sliding_window_duration)
        end_time = self.time_buffer[-1]
        if end_time - start_time < 0.1:  # Less than 100ms of data, not enough for reliable sequence
            return []
        # Calculate how many frames we need based on target FPS and available time window
        available_duration = min(end_time - start_time, self.sliding_window_duration)
        num_frames = min(self.sequence_length, int(available_duration * self.target_fps))
        if num_frames < 3:  # Need at least a few frames for meaningful prediction
            return []
        # Generate evenly spaced timestamps
        timestamps = np.linspace(end_time - available_duration, end_time, num_frames)
        # Interpolate features at each timestamp
        sequence = [self.interpolate_features(t) for t in timestamps]
        return sequence
    
    async def process_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """Process a video frame and return predictions using time-based interpolation"""
        start_proc_time = time.time()
        try:
            # Extract features and check for hand
            features, hand_detected = self.extract_features(frame)
            # Add frame and features to buffer with timestamp
            current_time = time.time()
            self.frame_buffer.append(frame)
            self.time_buffer.append(current_time)
            self.feature_buffer.append((features, hand_detected))
            # Clean up old frames
            while self.time_buffer and (current_time - self.time_buffer[0] > self.max_frame_age):
                self.time_buffer.popleft()
                self.frame_buffer.popleft()
                self.feature_buffer.popleft()
            #Update hand state
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

            # Only proceed with interpolation if a hand is present
            if not self.hand_present:
                 return []
            
            # Check if it's time to generate a new interpolated sequence
            if (current_time - self.last_interpolation_time >= self.interpolation_interval):
                self.last_interpolation_time = current_time
                # Generate interpolated sequence
                self.sequence_buffer = self.generate_interpolated_sequence()

                # Only make prediction if we have enough frames
                if len(self.sequence_buffer) < self.sequence_length // 2:  # Allow at least half the sequence length
                    return []
                
                # Pad sequence if needed (this ensures model gets exactly what it expects)
                if len(self.sequence_buffer) < self.sequence_length:
                    # Pad by repeating the last frame
                    pad_length = self.sequence_length - len(self.sequence_buffer)
                    self.sequence_buffer.extend([self.sequence_buffer[-1]] * pad_length)
               
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
                
                # Prediction smoothing - only show after consistent predictions
                if len(self.action_seq) < 2:
                    return []
                    
                # Keep action sequence from getting too long
                if len(self.action_seq) > 5:
                    self.action_seq = self.action_seq[-5:]
                    
                # Check for consistent predictions
                # Only return prediction if the latest N predictions are the same
                if len(set(self.action_seq[-2:])) == 1:  # Last 2 predictions are the same
                    print(f"Prediction: {action}, confidence: {confidence:.2f}")
                    # Track processing time for performance monitoring
                    proc_time = time.time() - start_proc_time
                    self.processing_times.append(proc_time)
                    # Periodically log performance stats
                    if len(self.processing_times) % 30 == 0:
                        avg_time = sum(self.processing_times) / len(self.processing_times)
                        self.actual_fps = 1.0 / avg_time if avg_time > 0 else 0
                        print(f"Processing stats: Avg time: {avg_time*1000:.1f}ms, Effective FPS: {self.actual_fps:.1f}")
                    
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