import asyncio
import websockets
import json
import cv2
import numpy as np
from base64 import b64decode
import tensorflow as tf
from typing import List

class KerasInferenceServer:
    def __init__(self, 
                 host='localhost', 
                 port=8765, 
                 model_path="C:\\signify-plus\\ml\\models_cache\\best_model.keras"):
        """
        host: IP/domain to run the WebSocket server
        port: Port for the server
        model_path: Path to your Keras model file
        """
        self.host = host
        self.port = port
        # Load the Keras model (which was trained on sequences of shape (30, 99))
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
        
    def extract_features(self, frame: np.ndarray) -> np.ndarray:
        """
        Extract a 99-dimensional feature vector from the frame.
        Here we convert the frame to grayscale and resize it to 11x9 pixels
        (since 11*9 = 99). Adjust this function to mirror your training preprocessing.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Resize to (width=11, height=9); note: cv2.resize takes (width, height)
        resized = cv2.resize(gray, (11, 9))
        features = resized.flatten().astype(np.float32) / 255.0
        return features  # Shape: (99,)
    
    async def process_frame(self, frame: np.ndarray) -> List[dict]:
        """
        Process an incoming frame:
          1. Extract a 99-D feature vector.
          2. Append it to a buffer.
          3. When the buffer has 30 feature vectors, form a sequence tensor
             of shape (1, 30, 99) and run inference.
        """
        try:
            features = self.extract_features(frame)
            self.sequence_buffer.append(features)
            
            # If we don't yet have 30 timesteps, simply return an empty result.
            if len(self.sequence_buffer) < self.sequence_length:
                return []
            
            # Use the last 30 feature vectors as one input sequence.
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
                        # Decode base64-encoded JPEG image
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
            model_path="C:\\signify-plus\\ml\\models_cache\\best_model.keras"
        )
        loop = asyncio.get_event_loop()
        loop.run_until_complete(server.start())
        loop.run_forever()
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()
