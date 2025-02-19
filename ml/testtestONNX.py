import asyncio
import websockets
import json
import cv2
import numpy as np
from base64 import b64decode
import onnxruntime as ort
from typing import List, Tuple

class ONNXInferenceServer:
    def __init__(self, host='139.179.150.117', port=8765, model_path="./models_cache/signify-plus/4/weights.onnx"):
        self.host = host
        self.port = port
        # Initialize ONNX Runtime
        self.session = ort.InferenceSession(
            model_path, 
            providers=['CPUExecutionProvider']
        )
        self.input_name = self.session.get_inputs()[0].name
        print("ONNX Runtime Inference Server initialized")

    async def process_frame(self, frame: np.ndarray) -> List[dict]:
        """Process a single frame using ONNX Runtime"""
        try:
            # Preprocess frame
            input_tensor = self.preprocess(frame)
            
            # Run inference
            outputs = self.session.run(None, {self.input_name: input_tensor})
            
            # Post-process results
            predictions = self.postprocess(outputs)
            
            return predictions
            
        except Exception as e:
            print(f"Error processing frame: {e}")
            return []

    def preprocess(self, frame: np.ndarray) -> np.ndarray:
        """Preprocess frame for model input"""
        # Convert BGR to RGB first
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # Maintain aspect ratio while resizing to 1024x1024
        h, w = frame.shape[:2]
        scale = 1024 / max(h, w)
        new_h, new_w = int(h * scale), int(w * scale)
        resized = cv2.resize(rgb, (new_w, new_h))
        
        # Create a black square canvas of 1024x1024
        canvas = np.zeros((1024, 1024, 3), dtype=np.uint8)
        
        # Calculate position to paste resized image
        y_offset = (1024 - new_h) // 2
        x_offset = (1024 - new_w) // 2
        
        # Paste the resized image onto the canvas
        canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        # Normalize (using standard normalization)
        normalized = canvas.astype(np.float32) / 255.0
        
        # Add batch dimension and transpose to NCHW
        batched = np.expand_dims(normalized, 0)
        transposed = np.transpose(batched, (0, 3, 1, 2)) 
        return transposed 

    def postprocess(self, outputs: List[np.ndarray]) -> List[dict]:
        """Convert model outputs to predictions"""
        # Class map for sign language gestures
        gesture_names = {
            0: "-", 1: "a", 2: "b", 3: "c", 4: "confirm", 
            5: "d", 6: "e", 7: "f", 8: "go", 9: "hi",
            10: "i", 11: "k", 12: "l", 13: "me", 14: "meet",
            15: "new", 16: "o", 17: "r", 18: "s", 19: "see",
            20: "t", 21: "think", 22: "time", 23: "try", 24: "u",
            25: "w", 26: "what", 27: "what-s-up", 28: "y", 29: "yes"
        }
        
        output = outputs[0][0]  # Remove batch dimension
        output = output.transpose(1, 0)  # Transpose to (21504, 34)

        predictions = []
        confidence_threshold = 0.1
        
        for detection in output:
            # Get class scores (skip first 4 values which are box coordinates)
            class_scores = detection[4:]
            
            # Get class with highest confidence
            class_id = np.argmax(class_scores)
            confidence = class_scores[class_id]
            
            if confidence > confidence_threshold:
                gesture = gesture_names.get(class_id, "unknown")
                predictions.append({
                    'gesture': gesture,
                    'confidence': float(confidence),
                })
        
        # Sort by confidence and get unique gestures
        predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)
        
        # Remove duplicate gestures, keeping the highest confidence one
        seen_gestures = set()
        unique_predictions = []
        for pred in predictions:
            if pred['gesture'] not in seen_gestures:
                seen_gestures.add(pred['gesture'])
                unique_predictions.append(pred)
                
                # Print each unique detection
                print(f"Detected: {pred['gesture']} ({pred['confidence']:.2f})")
        
        return unique_predictions

    async def handle_client(self, websocket):
        """Handle WebSocket client connection"""
        print("New client connected")
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data["type"] == "frame":
                        # Decode base64 frame
                        jpg_data = b64decode(data["data"])
                        nparr = np.frombuffer(jpg_data, np.uint8)
                        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        
                        # Process frame
                        predictions = await self.process_frame(frame)
                        
                        # Send back results
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
        """Start the WebSocket server"""
        server = await websockets.serve(
            self.handle_client,
            "0.0.0.0",
            self.port
        )
        print(f"Inference server running on ws://{self.host}:{self.port}")
        await server.wait_closed()

def main():
    try:
        server = ONNXInferenceServer()
        asyncio.get_event_loop().run_until_complete(server.start())
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()