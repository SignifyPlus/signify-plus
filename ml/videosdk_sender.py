import asyncio
import json
import websockets
from base64 import b64encode
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
import cv2
from av import VideoFrame
import numpy as np
from collections import deque
from time import time

VIDEOSDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c"
MEETING_ID = "3ffv-bulx-e80r"
WEBSOCKET_URL = "ws://localhost:8765"  # Adjust if inference server is on different machine

meeting: Meeting = None

class OptimizedWebSocketProcessor:
    def __init__(self) -> None:
        self.ml_websocket = None
        self.react_clients = set()  # Store connected React clients
        self.last_process_time = 0
        self.frame_interval = 1/15
        self.processing_queue = asyncio.Queue(maxsize=1)
        self.last_predictions = []
        self.is_processing = False
        # Start WebSocket server for React clients
        self.start_react_server()
    
    def start_react_server(self):
        """Start WebSocket server for React clients"""
        async def react_server():
            async with websockets.serve(self.handle_react_client, "0.0.0.0", 8766):
                print(f"React WebSocket server running on port 8766")
                await asyncio.Future()  # run forever

        asyncio.create_task(react_server())

    async def handle_react_client(self, websocket):
        """Handle connections from React clients"""
        print(f"React client connected from {websocket.remote_address}")
        self.react_clients.add(websocket)
        try:
            # Send a test message upon connection
            test_message = json.dumps({
                "status": "success",
                "predictions": [{"gesture": "test", "confidence": 1.0}]
            })
            await websocket.send(test_message)
            print("Sent test message to new client")
            
            # Keep connection alive and wait for closure
            await websocket.wait_closed()
        except Exception as e:
            print(f"Error in React client handler: {e}")
        finally:
            self.react_clients.remove(websocket)
            print(f"React client disconnected from {websocket.remote_address}")

    async def broadcast_to_react_clients(self, predictions):
        """Send predictions to all connected React clients"""
        if self.react_clients:
            message = json.dumps({
                "status": "success",
                "predictions": predictions
            })
            print(f"Broadcasting to {len(self.react_clients)} React clients")
            print(f"Message content: {message}")
            
            websockets_to_remove = set()
            
            for websocket in self.react_clients:
                try:
                    print(f"Attempting to send to client...")
                    await websocket.send(message)
                    print("Successfully sent message to client")
                except websockets.exceptions.ConnectionClosed:
                    print("Client connection was closed")
                    websockets_to_remove.add(websocket)
                except Exception as e:
                    print(f"Error sending to React client: {e}")
                    websockets_to_remove.add(websocket)
            
            # Remove any disconnected clients
            if websockets_to_remove:
                print(f"Removing {len(websockets_to_remove)} disconnected clients")
                self.react_clients -= websockets_to_remove
        else:
            print("No React clients connected to broadcast to")



    async def ensure_connection(self):
        """Ensure WebSocket connection to ML server"""
        if self.ml_websocket is None or self.ml_websocket.closed:
            try:
                self.ml_websocket = await websockets.connect(WEBSOCKET_URL)
                print(f"Connected to ML server at {WEBSOCKET_URL}")
            except Exception as e:
                print(f"ML server connection failed: {e}")
                self.ml_websocket = None
                await asyncio.sleep(1)
        
    async def start_processing_loop(self):
        """Separate processing loop to handle frames asynchronously"""
        self.is_processing = True
        while self.is_processing:
            try:
                frame = await self.processing_queue.get()
                if frame is not None:
                    await self.process_single_frame(frame)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in processing loop: {e}")
                await asyncio.sleep(0.1)  # Prevent tight loop on errors

    async def process(self, frame: VideoFrame) -> VideoFrame:
        current_time = time()
        
        # Only process if enough time has passed since last processing
        if current_time - self.last_process_time >= self.frame_interval:
            try:
                # Convert frame to image
                img = frame.to_ndarray(format="bgr24")
                
                # Try to put frame in queue, drop if queue is full
                try:
                    self.processing_queue.put_nowait(img)
                    self.last_process_time = current_time
                except asyncio.QueueFull:
                    pass  # Drop frame if queue is full
                    
            except Exception as e:
                print(f"Error queuing frame: {e}")
        
        return frame

    async def process_single_frame(self, img):
        """Process a single frame with the inference server"""
        if not self.ml_websocket:
            await self.ensure_connection()
            
        if self.ml_websocket:
            try:
                # Convert to jpg for efficient transfer
                _, buffer = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 105])
                frame_data = b64encode(buffer).decode('utf-8')
                
                # Send frame
                message = {"type": "frame", "data": frame_data}
                await self.ml_websocket.send(json.dumps(message))
                
                # Get results
                response = await self.ml_websocket.recv()
                results = json.loads(response)
                
                if results.get("status") == "success":
                    predictions = results.get("predictions", [])
                    print("Received predictions from ML server:", predictions)
                    self.last_predictions = predictions
                    # Broadcast predictions to React clients
                    print("Attempting to broadcast predictions to React clients...")
                    await self.broadcast_to_react_clients(predictions)
                    print("Finished broadcasting predictions")
            except Exception as e:
                print(f"Error in frame processing: {e}")
                self.ml_websocket = None

class ProcessedVideoTrack(CustomVideoTrack):
    """
    A video stream track that transforms frames from another track.
    """
    # kind = "video"

    # def __init__(self, track):
    #     super().__init__()  # don't forget this!
    #     self.track = track
    #     self.processor = WebSocketProcessor()

    # async def recv(self):
    #     frame = await self.track.recv()
    #     new_frame = await self.processor.process(frame)
    #     return new_frame
    def __init__(self, track):
        super().__init__()
        self.track = track
        self.processor = OptimizedWebSocketProcessor()
        # Start processing loop
        asyncio.create_task(self.processor.start_processing_loop())

    async def recv(self):
        frame = await self.track.recv()
        return await self.processor.process(frame)

    def stop(self):
        self.processor.is_processing = False

def process_video(track: CustomVideoTrack):
    global meeting
    meeting.add_custom_video_track(
        track=ProcessedVideoTrack(track=track)
    )

class MyMeetingEventHandler(MeetingEventHandler):
    def __init__(self):
        super().__init__()

    def on_meeting_left(self, data):
        print("on_meeting_left")

    def on_participant_joined(self, participant: Participant):
        participant.add_event_listener(
            MyParticipantEventHandler(participant_id=participant.id)
        )

    def on_participant_left(self, participant: Participant):
        print("on_participant_left")

class MyParticipantEventHandler(ParticipantEventHandler):
    def __init__(self, participant_id: str):
        super().__init__()
        self.participant_id = participant_id

    def on_stream_enabled(self, stream: Stream):
        print("on_stream_enabled: " + stream.kind)
        if stream.kind == "video":
            process_video(track=stream.track)

    def on_stream_disabled(self, stream: Stream):
        print("on_stream_disabled")

def main():
    global meeting
    # Example usage:
    meeting_config = MeetingConfig(
        meeting_id=MEETING_ID,
        name='AI_MODEL',
        mic_enabled=False,
        webcam_enabled=False,
        token=VIDEOSDK_TOKEN,
    )
    meeting = VideoSDK.init_meeting(**meeting_config)

    print("adding event listener...")
    meeting.add_event_listener(MyMeetingEventHandler())

    print("joining into meeting...")
    meeting.join()

if __name__ == "__main__":
    main()
    asyncio.get_event_loop().run_forever()