import asyncio
import json
import websockets
from base64 import b64encode
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
import cv2
from av import VideoFrame
from time import time
from typing import Set, Optional
from contextlib import suppress
import aiohttp

VIDEOSDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c"
WEBSOCKET_URL = "ws://localhost:8765"

async def wait_for_meeting_id():
    meeting_id = None
    while meeting_id is None:
        meeting_id = await get_meeting_id()
        if meeting_id is None:
            print("Meeting ID not available yet, waiting...")
            await asyncio.sleep(5)
    return meeting_id

async def get_meeting_id():
    url = "https://living-openly-ape.ngrok-free.app/meeting-id"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            MEETING_ID = data.get("meetingId")
            if MEETING_ID:
                print(f"Retrieved meeting ID: {MEETING_ID}")
                return MEETING_ID
            else:
                print("No meeting ID available:", data)
                return None

async def monitor_meeting():
    global meeting
    current_meeting_id = None
    while True:
        new_meeting_id = await get_meeting_id()
        if new_meeting_id:
            if current_meeting_id is None or new_meeting_id != current_meeting_id:
                print(f"New meeting id detected: {new_meeting_id}")
                # If there's an active meeting, leave it
                if meeting is not None:
                    print("Leaving current meeting...")
                    meeting.leave()
                    for participant in meeting.participants.values():
                        for stream in participant.streams.values():
                            if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                                await stream.track.stop()
                # Update the current meeting id and join the new meeting
                current_meeting_id = new_meeting_id
                meeting_config = MeetingConfig(
                    meeting_id=new_meeting_id,
                    name='AI_MODEL',
                    mic_enabled=False,
                    webcam_enabled=False,
                    token=VIDEOSDK_TOKEN,
                )
                meeting = VideoSDK.init_meeting(**meeting_config)
                meeting.add_event_listener(MyMeetingEventHandler())
                print("Joining new meeting...")
                meeting.join()
            else:
                print("Meeting id unchanged.")
        else:
            print("No meeting id available at the moment.")
            # If there's an active meeting and the meeting id becomes null, end it.
            if meeting is not None:
                print("Received null meeting id, ending current meeting...")
                meeting.leave()
                for participant in meeting.participants.values():
                    for stream in participant.streams.values():
                        if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                            await stream.track.stop()
                current_meeting_id = None
                meeting = None
        await asyncio.sleep(5)

meeting: Meeting = None

class OptimizedWebSocketProcessor:
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
        async with websockets.serve(self.handle_react_client, 'localhost', 8766):
            print(f"React WebSocket server running on port 8766 with ip: {self.host}")
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
        self.processor = OptimizedWebSocketProcessor()
        # Start processor
        asyncio.create_task(self.processor.start())

    async def recv(self):
        frame = await self.track.recv()
        return await self.processor.process(frame)

    async def stop(self):
        await self.processor.cleanup()

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

async def main():
    try:
        # Start the monitor_meeting task in the background
        monitor_task = asyncio.create_task(monitor_meeting())
        
        # Wait indefinitely so that monitor_meeting keeps running
        await asyncio.Future()  # This future will never complete
    except Exception as e:
        print(f"Error in main: {e}")
        raise
    finally:
        print("Cleaning up...")
        if meeting:
            try:
                # Stop any custom video tracks that may be active
                for participant in meeting.participants.values():
                    for stream in participant.streams.values():
                        if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                            await stream.track.stop()
                meeting.leave()
                print("Successfully left meeting")
            except Exception as e:
                print(f"Error during cleanup: {e}")

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