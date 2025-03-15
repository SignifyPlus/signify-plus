import asyncio
import websockets
import json
import cv2
import numpy as np
from base64 import b64decode
import tensorflow as tf
from typing import List
import mediapipe as mp

class KerasInferenceServer:
    def __init__(self, 
             host='0.0.0.0', 
             port=8765, 
             model_path=".\\models_cache\\model.keras"):
        """
        host: IP/domain to run the WebSocket server
        port: Port for the server
        model_path: Path to your Keras model file
        """
        self.host = host
        self.port = port
        # Load the Keras model (trained on sequences of shape (30, 99))
        self.model = tf.keras.models.load_model(model_path)
        print("Keras model loaded successfully.")
        
        # Class names as defined in your actions.txt (update as needed)
        self.class_names = [
            "welcome", "we", "happy", "you", "here",
            "today", "topic", "c", "t", "i", "s"
        ]
        
        self.sequence_length = 30
        self.sequence_buffer = [] 
        self.action_seq = []  # Initialize action sequence
        
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5   
        )
        
        # Hand state tracking (simplified)
        self.no_hand_counter = 0
        self.no_hand_threshold = 3
        self.hand_present = False
        self.last_prediction = None
    
    def extract_features(self, frame: np.ndarray) -> tuple:
        """
        Extract a 99-dimensional feature vector from the frame using MediaPipe Hands.
        Returns (features, hand_detected_flag)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
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
            
            # Concatenate joint.flatten() (84 values) and angle (15 values) to get 99 features.
            d = np.concatenate([joint.flatten(), angle])
            return d, True
        return np.zeros(99, dtype=np.float32), False
    
    async def process_frame(self, frame: np.ndarray) -> List[dict]:
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
                if confidence < 0.95:
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
    
    async def handle_client(self, websocket):
        """Handle WebSocket client connection"""
        print("New client connected")
        
        # Helper function for sending responses
        async def send_response(status, data=None, error=None):
            response = {"status": status}
            if data is not None:
                response.update(data)
            if error is not None:
                response["message"] = str(error)
            await websocket.send(json.dumps(response))
            
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data.get("type") == "frame":
                        jpg_data = b64decode(data["data"])
                        nparr = np.frombuffer(jpg_data, np.uint8)
                        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        
                        predictions = await self.process_frame(frame)
                        await send_response("success", {"predictions": predictions})
                except Exception as e:
                    print(f"Error processing message: {e}")
                    await send_response("error", error=e)
        except websockets.exceptions.ConnectionClosed:
            print("Client connection closed")
    
    async def start(self):
        """Start the WebSocket server"""
        server = await websockets.serve(self.handle_client, self.host, self.port)
        print(f"Inference server running on ws://{self.host}:{self.port}")
        await server.wait_closed()

def main():
    try:
        server = KerasInferenceServer(
            model_path=".\\models_cache\\model.keras"
        )
        loop = asyncio.get_event_loop()
        loop.run_until_complete(server.start())
        loop.run_forever()
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()