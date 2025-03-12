import asyncio
import websockets
import json
import cv2
from av import VideoFrame
import numpy as np
from time import time
from typing import Optional
from contextlib import suppress
import aiohttp
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
from av import VideoFrame
# from meetingEventHandler import MeetingEventHandler

# VideoSDK configuration
VIDEOSDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c"
WEBSOCKET_URL = "ws://localhost:8765"  

# Global meeting variable (initialized to None)
meeting: Meeting = None

#########################
# MEETING ID AUTOMATION #
#########################

# Function to fetch the meeting id from the ngrok endpoint
async def get_meeting_id():
    url = "https://moving-cardinal-happily.ngrok-free.app/meeting-id"
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                data = await response.json()
                MEETING_ID = data.get("meetingId")
                if MEETING_ID:
                    print(f"Retrieved meeting ID: {MEETING_ID}")
                    return MEETING_ID
                else:
                    print("No meeting ID available:", data)
                    return None
        except Exception as e:
            print("Error fetching meeting ID:", e)
            return None

# Monitor meeting ID changes and update the active meeting accordingly
async def monitor_meeting():
    global meeting
    current_meeting_id = None
    while True:
        new_meeting_id = await get_meeting_id()
        if new_meeting_id:
            if current_meeting_id is None or new_meeting_id != current_meeting_id:
                print(f"New meeting id detected: {new_meeting_id}")
                # If there's an active meeting, leave it and clean up video tracks
                if meeting is not None:
                    print("Leaving current meeting...")
                    meeting.leave()
                    for participant in meeting.participants.values():
                        for stream in participant.streams.values():
                            if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                                await stream.track.stop()
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
            # If meeting id is cleared while in a meeting, end it.
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

##############################################
# GLOBAL REACT WEBSOCKET SERVER (Option 1)   #
##############################################

# Global set to store connected React clients
global_react_clients = set()

async def handle_react_client_global(websocket: websockets.WebSocketServerProtocol):
    print(f"Global React client connected from {websocket.remote_address}")
    global_react_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        global_react_clients.remove(websocket)

async def start_global_react_server():
    async with websockets.serve(handle_react_client_global, "0.0.0.0", 8766):
        print("Persistent Global React WebSocket server running on port 8766")
        await asyncio.Future()

async def broadcast_global(predictions):
    if not global_react_clients:
        return
    message = json.dumps({
        "status": "success",
        "predictions": predictions
    })
    send_tasks = [asyncio.create_task(ws.send(message)) for ws in list(global_react_clients)]
    if send_tasks:
        await asyncio.gather(*send_tasks, return_exceptions=True)

##############################################
# EXISTING VIDEO/ML PROCESSOR (Modified)     #
##############################################

class OptimizedWebSocketProcessor:
    def __init__(self) -> None:
        self.ml_websocket: Optional[websockets.WebSocketClientProtocol] = None
        # Removed instance-specific react_clients; using global instead.
        self.last_process_time = 0
        self.frame_interval = 1/2
        self.last_predictions = []
        self.is_processing = False
        self.processing_task = None
        self.current_frame = None
        self.frame_ready = asyncio.Event()

    async def start(self):
        """Initialize and start all async tasks"""
        self.is_processing = True
        # Connect to ML server first
        await self.ensure_ml_connection()
        # Start frame processing loop (do not start a per-instance react server)
        self.processing_task = asyncio.create_task(self.process_frames())
    
    async def cleanup(self):
        """Clean up all resources and connections"""
        self.is_processing = False
        if self.ml_websocket:
            await self.ml_websocket.close()
        if self.processing_task:
            self.processing_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.processing_task
    
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
                # Convert frame to jpg with optimal settings
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
                        # Broadcast predictions to the global React WebSocket clients
                        await broadcast_global(predictions)
                
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
        # Start the processor
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

##############################################
# EVENT HANDLERS (Unchanged)                 #
##############################################

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
        print(f"Stream enabled: {stream.kind}")
        if stream.kind == "video":
            process_video(track=stream.track)
    def on_stream_disabled(self, stream: Stream):
        print("on_stream_disabled")

##############################################
# MAIN FUNCTION                              #
##############################################

async def main():
    global meeting
    try:
        # Start the meeting ID monitor in the background
        monitor_task = asyncio.create_task(monitor_meeting())
        # Start the persistent global React WebSocket server
        react_server_task = asyncio.create_task(start_global_react_server())
        # Wait indefinitely
        await asyncio.Event().wait()
    except Exception as e:
        print(f"Error in main: {e}")
        raise
    finally:
        print("Cleaning up...")
        if meeting:
            try:
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
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nReceived keyboard interrupt, shutting down...")
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        pending = asyncio.all_tasks()
        for task in pending:
            task.cancel()