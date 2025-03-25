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
                 model_path="/Users/borandenizduzgun/Projects/signpl/signify-plus/ml/models_cache/model.keras"):
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
        
        # Set the expected sequence length (timesteps) and initialize buffer
        self.sequence_length = 30  # Model expects sequences of 30 timesteps
        self.sequence_buffer = []  # Buffer to accumulate feature vectors
        
        # Initialize MediaPipe Hands (matching dynamic_create_dataset.py)
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=0
        )
    
    def extract_features(self, frame: np.ndarray) -> np.ndarray:
        """
        Extract a 99-dimensional feature vector from the frame using MediaPipe Hands.
        This replicates the feature extraction in dynamic_create_dataset.py.
        Steps:
          1. Convert the frame to RGB.
          2. Process with MediaPipe Hands.
          3. For the first detected hand:
             - Build a joint matrix (21 x 4) from the landmarks.
             - Compute v1 and v2 using the index arrays:
                   idx1 = [0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19]
                   idx2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
             - Compute v = v2 - v1 and normalize it.
             - Compute angles between vectors:
                   idx_angle1 = [0,1,2,4,5,6,8,9,10,12,13,14,16,17,18]
                   idx_angle2 = [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19]
             - Convert the angles to degrees.
             - Concatenate joint.flatten() (84 values) with the angle array (15 values) to yield 99 values.
          4. If no hand is detected, return a zero vector.
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            # Use the first detected hand
            hand_landmarks = results.multi_hand_landmarks[0]
            joint = np.zeros((21, 4), dtype=np.float32)
            for j, lm in enumerate(hand_landmarks.landmark):
                joint[j] = [lm.x, lm.y, lm.z, lm.visibility]
            
            # Compute differences using the same indices as in dataset creation
            idx1 = [0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19]
            idx2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            v1 = joint[idx1, :3]
            v2 = joint[idx2, :3]
            v = v2 - v1
            v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
            
            idx_angle1 = [0,1,2,4,5,6,8,9,10,12,13,14,16,17,18]
            idx_angle2 = [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19]
            v_angle1 = v[idx_angle1, :]
            v_angle2 = v[idx_angle2, :]
            dot = np.einsum('ij,ij->i', v_angle1, v_angle2)
            dot = np.clip(dot, -1.0, 1.0)
            angle = np.arccos(dot)
            angle = np.degrees(angle)
            
            # Concatenate joint.flatten() (84 values) and angle (15 values) to get 99 features.
            d = np.concatenate([joint.flatten(), angle])
            return d
        else:
            return np.zeros(99, dtype=np.float32)
    
    async def process_frame(self, frame: np.ndarray) -> List[dict]:
        """
        Process an incoming frame:
          1. Extract a 99-D feature vector.
          2. Append it to the sequence buffer.
          3. When the buffer has 30 timesteps, form a tensor of shape (1, 30, 99) and run inference.
        """
        try:
            features = self.extract_features(frame)
            self.sequence_buffer.append(features)
            
            if len(self.sequence_buffer) < self.sequence_length:
                return []
            
            seq = self.sequence_buffer[-self.sequence_length:]
            input_sequence = np.array(seq, dtype=np.float32)  # Shape: (30, 99)
            input_tensor = np.expand_dims(input_sequence, axis=0)  # Shape: (1, 30, 99)
            
            predictions = self.model.predict(input_tensor)
            result = self.postprocess(predictions)
            return result
        except Exception as e:
            print(f"Error during inference: {e}")
            return []
    
    def postprocess(self, predictions: np.ndarray) -> List[dict]:
        """
        Process model predictions.
        Assumes predictions is a 2D array of shape (1, num_classes).
        Returns the top prediction as a dictionary.
        """
        probs = predictions[0]
        class_id = int(np.argmax(probs))
        confidence = float(probs[class_id])
        action_label = self.class_names[class_id] if class_id < len(self.class_names) else "unknown"
        print(f"Top prediction: {action_label}, confidence: {confidence:.2f}")
        return [{"action": action_label, "confidence": confidence}]
    
    async def handle_client(self, websocket):
        """
        Handle an incoming WebSocket client connection.
        Receives base64-encoded frames, runs inference when a full sequence is accumulated,
        and sends back predictions.
        """
        print("New client connected")
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data.get("type") == "frame":
                        jpg_data = b64decode(data["data"])
                        nparr = np.frombuffer(jpg_data, np.uint8)
                        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        
                        predictions = await self.process_frame(frame)
                        
                        await websocket.send(json.dumps({
                            "status": "success",
                            "predictions": predictions
                        }))
                except Exception as e:
                    print(f"Error processing message: {e}")
                    await websocket.send(json.dumps({
                        "status": "error",
                        "message": str(e)
                    }))
        except websockets.exceptions.ConnectionClosed:
            print("Client connection closed")
    
    async def start(self):
        """
        Start the WebSocket server.
        """
        server = await websockets.serve(self.handle_client, "0.0.0.0", self.port)
        print(f"Inference server running on ws://{self.host}:{self.port}")
        await server.wait_closed()

def main():
    try:
        server = KerasInferenceServer(
            model_path="/Users/borandenizduzgun/Projects/signpl/signify-plus/ml/models_cache/model.keras"
        )
        loop = asyncio.get_event_loop()
        loop.run_until_complete(server.start())
        loop.run_forever()
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()