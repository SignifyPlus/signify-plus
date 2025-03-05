import asyncio
import websockets
import json
import cv2
import numpy as np
from base64 import b64encode, b64decode
import tensorflow as tf
from typing import List, Set, Optional
import mediapipe as mp
from collections import deque
from time import time
from contextlib import suppress
import aiohttp
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
from av import VideoFrame

# VideoSDK configuration
VIDEOSDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c"
REACT_WS_PORT = 8766
NGROK_URL = "living-openly-ape.ngrok-free.app"

class SignLanguageProcessor:
    def __init__(self, model_path="./models_cache/best_model.keras"):
        """
        Initialize the sign language processing components
        
        Args:
            model_path: Path to the Keras model file
        """
        # Load the Keras model (trained on sequences of shape (30, 99))
        self.model = tf.keras.models.load_model(model_path)
        print("Keras model loaded successfully.")
        
        # Class names as defined in your actions.txt
        self.class_names = [
            "welcome", "we", "happy", "you", "here",
            "today", "topic", "c", "t", "i", "s"
        ]
        
        # Set the expected sequence length (timesteps) and initialize buffer
        self.sequence_length = 30  # Model expects sequences of 30 timesteps
        self.sequence_buffer = []  # Buffer to accumulate feature vectors
        
        # Initialize MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=0
        )
        
        # For managing React clients
        self.react_clients: Set[websockets.WebSocketServerProtocol] = set()
        self.last_predictions = []
        self.react_server_task = None
        
        # For frame processing
        self.last_process_time = 0
        self.frame_interval = 1/2  # Process at 2 FPS

    def extract_features(self, frame: np.ndarray) -> np.ndarray:
        """
        Extract a 99-dimensional feature vector from the frame using MediaPipe Hands.
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
        Process an incoming frame for sign language recognition
        """
        try:
            features = self.extract_features(frame)
            self.sequence_buffer.append(features)
            
            if len(self.sequence_buffer) < self.sequence_length:
                return []
            
            # Use only the most recent sequence_length frames
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
        """
        probs = predictions[0]
        class_id = int(np.argmax(probs))
        confidence = float(probs[class_id])
        action_label = self.class_names[class_id] if class_id < len(self.class_names) else "unknown"
        print(f"Top prediction: {action_label}, confidence: {confidence:.2f}")
        return [{"action": action_label, "confidence": confidence}]
    
    async def start_react_server(self):
        """Start WebSocket server for React clients"""
         # Use '0.0.0.0' instead of 'localhost' to accept connections from any IP
        async with websockets.serve(self.handle_react_client, '0.0.0.0', REACT_WS_PORT):
            print(f"React WebSocket server running on port {REACT_WS_PORT}, accepting connections from any IP")
            await asyncio.Future()  # Run forever


    async def handle_react_client(self, websocket: websockets.WebSocketServerProtocol):
        """Handle connections from React clients"""
        print(f"React client connected from {websocket.remote_address}")
        self.react_clients.add(websocket)
        try:
            await websocket.wait_closed()
        finally:
            self.react_clients.remove(websocket)

    async def broadcast_to_react_clients(self, predictions):
        """Send predictions to all connected React clients"""
        if not self.react_clients:
            return
            
        message = json.dumps({
            "status": "success",
            "predictions": predictions
        })
        
        send_tasks = []
        for websocket in list(self.react_clients):
            try:
                task = asyncio.create_task(websocket.send(message))
                send_tasks.append(task)
            except Exception:
                self.react_clients.remove(websocket)
        
        if send_tasks:
            await asyncio.gather(*send_tasks, return_exceptions=True)

    async def start(self):
        """Start the React WebSocket server"""
        self.react_server_task = asyncio.create_task(self.start_react_server())

    async def cleanup(self):
        """Cleanup resources"""
        # Close all client connections
        for ws in self.react_clients:
            await ws.close()
        self.react_clients.clear()

         # Cancel server task
        if self.react_server_task:
            self.react_server_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.react_server_task

class VideoProcessingTrack(CustomVideoTrack):
    def __init__(self, track, processor: SignLanguageProcessor):
        super().__init__()
        self.track = track
        self.processor = processor
        self.last_process_time = 0
        self.frame_interval = 1/2  # Process at 2 FPS

    async def recv(self):
        frame = await self.track.recv()
    
        current_time = time()
        if current_time - self.last_process_time >= self.frame_interval:
            try:
                # Convert frame to numpy array
                np_frame = frame.to_ndarray(format="bgr24")
                
                # Process the frame for sign language recognition
                predictions = await self.processor.process_frame(np_frame)
                
                # If we have new predictions, broadcast them
                if predictions != self.processor.last_predictions:
                    self.processor.last_predictions = predictions
                    await self.processor.broadcast_to_react_clients(predictions)
                
                self.last_process_time = current_time
            except Exception as e:
                print(f"Error processing frame: {e}")
        
        return frame            
    
class MeetingManager:
    def __init__(self, processor: SignLanguageProcessor):
        self.processor = processor
        self.meeting = None
        self.meeting_monitor_task = None
    
    async def wait_for_meeting_id(self):
        """Wait until a meeting ID is available"""
        meeting_id = None
        while meeting_id is None:
            meeting_id = await self.get_meeting_id()
            if meeting_id is None:
                print("Meeting ID not available yet, waiting...")
                await asyncio.sleep(5)
        return meeting_id

    async def get_meeting_id(self):
        """Get meeting ID from server"""
        url = "https://{NGROK_URL}/meeting-id"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()
                meeting_id = data.get("meetingId")
                if meeting_id:
                    print(f"Retrieved meeting ID: {meeting_id}")
                    return meeting_id
                else:
                    print("No meeting ID available:", data)
                    return None

    async def monitor_meeting(self):
        """Monitor for meeting ID changes and join/leave accordingly"""
        current_meeting_id = None
        while True:
            new_meeting_id = await self.get_meeting_id()
            if new_meeting_id:
                if current_meeting_id is None or new_meeting_id != current_meeting_id:
                    print(f"New meeting id detected: {new_meeting_id}")
                    # If there's an active meeting, leave it
                    if self.meeting is not None:
                        print("Leaving current meeting...")
                        self.meeting.leave()
                    # Update the current meeting id and join the new meeting
                    current_meeting_id = new_meeting_id
                    meeting_config = MeetingConfig(
                        meeting_id=new_meeting_id,
                        name='AI_MODEL',
                        mic_enabled=False,
                        webcam_enabled=False,
                        token=VIDEOSDK_TOKEN,
                    )
                    self.meeting = VideoSDK.init_meeting(**meeting_config)
                    self.meeting.add_event_listener(MeetingEventHandler(processor=self.processor))
                    print("Joining new meeting...")
                    self.meeting.join()
                else:
                    print("Meeting id unchanged.")
            else:
                print("No meeting id available at the moment.")
                # If there's an active meeting and the meeting id becomes null, end it.
                if self.meeting is not None:
                    print("Received null meeting id, ending current meeting...")
                    self.meeting.leave()
                    current_meeting_id = None
                    self.meeting = None
            await asyncio.sleep(5)
    
    async def start(self):
        """Start the meeting manager"""
        self.meeting_monitor_task = asyncio.create_task(self.monitor_meeting())
        
    async def cleanup(self):
        """Cleanup resources"""
        if self.meeting:
            self.meeting.leave()
        
        if self.meeting_monitor_task:
            self.meeting_monitor_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.meeting_monitor_task

class MeetingEventHandler(MeetingEventHandler):
    def __init__(self, processor: SignLanguageProcessor):
        super().__init__()
        self.processor = processor

    def on_meeting_left(self, data):
        print("Meeting left")

    def on_participant_joined(self, participant: Participant):
        participant.add_event_listener(
            ParticipantEventHandler(participant_id=participant.id, processor=self.processor)
        )
        print(f"Participant joined: {participant.id}")

    def on_participant_left(self, participant: Participant):
        print(f"Participant left: {participant.id}")

class ParticipantEventHandler(ParticipantEventHandler):
    def __init__(self, participant_id: str, processor: SignLanguageProcessor):
        super().__init__()
        self.participant_id = participant_id
        self.processor = processor

    def on_stream_enabled(self, stream: Stream):
        print(f"Stream enabled: {stream.kind} by participant {self.participant_id}")
        if stream.kind == "video":
            # Process the video stream through our custom track
            self.process_video(track=stream.track)

    def on_stream_disabled(self, stream: Stream):
        print(f"Stream disabled: {stream.kind} by participant {self.participant_id}")

    def process_video(self, track: CustomVideoTrack):
        # Create a custom video track that processes frames for sign language recognition
        processed_track = VideoProcessingTrack(track=track, processor=self.processor)
        
        # Add the custom track to the meeting
        from videosdk import video_sdk
        video_sdk.meetings.get(self.participant_id).add_custom_video_track(
            track=processed_track
        )

async def main():
    try:
        # Initialize the sign language processor
        processor = SignLanguageProcessor(model_path="./models_cache/best_model.keras")
        
        # Start the React WebSocket server
        await processor.start()
        
        # Initialize and start the meeting manager
        meeting_manager = MeetingManager(processor=processor)
        await meeting_manager.start()
        
        # Keep the application running
        print("Application running. Press Ctrl+C to exit.")
        await asyncio.Future()  # This future will never complete
        
    except Exception as e:
        print(f"Error in main: {e}")
        raise
    finally:
        print("Cleaning up...")
        await processor.cleanup()
        if 'meeting_manager' in locals():
            await meeting_manager.cleanup()

if __name__ == "__main__":
    try:
        # Handle keyboard interrupt gracefully
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nReceived keyboard interrupt, shutting down...")
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        # Ensure all tasks are cleaned up
        pending = asyncio.all_tasks()
        for task in pending:
            task.cancel()