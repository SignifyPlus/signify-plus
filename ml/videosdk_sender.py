import asyncio
import websockets
import json
import cv2
from base64 import b64encode, b64decode
from typing import Set, Optional
from time import time
from contextlib import suppress
import aiohttp
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
from av import VideoFrame
# from meetingEventHandler import MeetingEventHandler

# VideoSDK configuration
VIDEOSDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c"
NGROK_URL = "living-openly-ape.ngrok-free.app"
WEBSOCKET_URL = "ws://localhost:8765"  

class SignLanguageProcessor:
    def __init__(self) -> None:
        self.ml_websocket: Optional[websockets.WebSocketClientProtocol] = None
        self.react_clients: Set[websockets.WebSocketServerProtocol] = set()
        self.last_process_time = 0
        self.frame_interval = 1/2
        self.last_predictions = []
        self.is_processing = False
        self.server_task = None
        self.processing_task = None
        self.current_frame = None
        self.frame_ready = asyncio.Event()

    async def start(self):
        """Initialize and start all async tasks"""
        self.is_processing = True
        # Connect to ML server first
        await self.ensure_ml_connection()
        # Start WebSocket server for React clients
        self.server_task = asyncio.create_task(self.start_react_server())
        # Start frame processing loop
        self.processing_task = asyncio.create_task(self.process_frames())

    async def cleanup(self):
        """Clean up all resources and connections"""
        self.is_processing = False
        if self.ml_websocket:
            await self.ml_websocket.close()
        for ws in self.react_clients:
            await ws.close()
        self.react_clients.clear()
        
        for task in [self.server_task, self.processing_task]:
            if task:
                task.cancel()
                with suppress(asyncio.CancelledError):
                    await task

    async def start_react_server(self):
        """Start WebSocket server for React clients"""
        async with websockets.serve(self.handle_react_client, "0.0.0.0", 8766):
            print("React WebSocket server running on port 8766")
            await asyncio.Future()

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
  
    async def ensure_ml_connection(self):
        """Ensure WebSocket connection to ML server exists"""
        while self.is_processing and (self.ml_websocket is None or self.ml_websocket.closed):
            try:
                self.ml_websocket = await websockets.connect(WEBSOCKET_URL)
                print(f"Connected to ML server at {WEBSOCKET_URL}")
                return True
            except Exception as e:
                print(f"ML server connection failed: {e}")
                await asyncio.sleep(0.5)
        return False
    
    async def process_frames(self):
        """Continuous frame processing loop"""
        while self.is_processing:
            await self.frame_ready.wait()
            self.frame_ready.clear()
            
            if self.current_frame is None:
                continue

            if not self.ml_websocket:
                if not await self.ensure_ml_connection():
                    continue

            try:
                # Convert to jpg with optimal settings for real-time
                _, buffer = cv2.imencode('.jpg', self.current_frame, 
                                      [cv2.IMWRITE_JPEG_QUALITY, 80,
                                       cv2.IMWRITE_JPEG_PROGRESSIVE, 0,
                                       cv2.IMWRITE_JPEG_OPTIMIZE, 1])
                
                frame_data = b64encode(buffer).decode('utf-8')
                
                await self.ml_websocket.send(json.dumps({
                    "type": "frame",
                    "data": frame_data
                }))
                
                response = await self.ml_websocket.recv()
                results = json.loads(response)
                
                if results.get("status") == "success":
                    predictions = results.get("predictions", [])
                    if predictions != self.last_predictions:
                        self.last_predictions = predictions
                        await self.broadcast_to_react_clients(predictions)
                
            except Exception as e:
                print(f"Error in frame processing: {e}")
                self.ml_websocket = None
                await asyncio.sleep(0.1)
    
    async def process(self, frame: VideoFrame) -> VideoFrame:
        """Process incoming video frames"""
        current_time = time()
        if current_time - self.last_process_time >= self.frame_interval:
            try:
                self.current_frame = frame.to_ndarray(format="bgr24")
                self.frame_ready.set()
                self.last_process_time = current_time
            except Exception as e:
                print(f"Error processing frame: {e}")
        return frame

class ProcessedVideoTrack(CustomVideoTrack):
    def __init__(self, track):
        super().__init__()
        self.track = track
        self.processor = SignLanguageProcessor()
        # Start processor
        asyncio.create_task(self.processor.start())

    async def recv(self):
        frame = await self.track.recv()
        return await self.processor.process(frame)

    async def stop(self):
        await self.processor.cleanup()
  
class ParticipantEventHandler(ParticipantEventHandler):
    def __init__(self, participant_id: str):
        super().__init__()
        self.participant_id = participant_id

    def on_stream_enabled(self, stream: Stream):
        print(f"Stream enabled: {stream.kind}")
        if stream.kind == "video":
            if MeetingManager.current_instance and MeetingManager.current_instance.meeting:
                MeetingManager.current_instance.process_video(track=stream.track)

    def on_stream_disabled(self, stream: Stream):
        print(f"Stream disabled: {stream.kind}")

class MeetingEventHandler(MeetingEventHandler):
    def __init__(self): #, processor: SignLanguageProcessor):
        super().__init__()
        # self.processor = processor

    def on_meeting_left(self, data):
        print("Meeting left")

    def on_participant_joined(self, participant: Participant):
        participant.add_event_listener(
            ParticipantEventHandler(participant_id=participant.id) #, processor=self.processor)
        )
        print(f"Participant joined: {participant.id}")

    def on_participant_left(self, participant: Participant):
        print(f"Participant left: {participant.id}")
   
class MeetingManager:
    current_instance = None

    def __init__(self):
        self.meeting = None
        self.meeting_monitor_task = None
        MeetingManager.current_instance = self
    
    async def get_meeting_id(self):
        """Get meeting ID from server"""
        url = f"https://{NGROK_URL}/meeting-id"
        try:
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
        except Exception as e:
            print(f"Error getting meeting ID: {e}")
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
        
    def process_video(self, track: CustomVideoTrack):
        """Process video track and add it to the meeting"""
        if self.meeting:
            self.meeting.add_custom_video_track(
                track=ProcessedVideoTrack(track=track)
            )
        else:
            print("Cannot process video: No active meeting")

    async def cleanup(self):
        """Cleanup resources"""
        if self.meeting:
            self.meeting.leave()
        
        if self.meeting_monitor_task:
            self.meeting_monitor_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.meeting_monitor_task
        
        if MeetingManager.current_instance == self:
            MeetingManager.current_instance = None

-+

ync def main():
    try:
        # Initialize the sign language processor
        processor = SignLanguageProcessor(model_path="./models_cache/best_model.keras")
        
        # Start the unified WebSocket server
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