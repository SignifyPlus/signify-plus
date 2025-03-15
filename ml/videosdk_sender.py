import asyncio
import json
import websockets
from base64 import b64encode
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
import cv2
from av import VideoFrame
import numpy as np
from time import time
from typing import Optional
from contextlib import suppress
import aiohttp
import os
import dotenv


dotenv.load_dotenv()

VIDEOSDK_TOKEN = os.environ.get('VIDEOSDK_TOKEN')
ML_WEBSOCKET_URL = os.environ.get('ML_WEBSOCKET_URL', 'ws://localhost:8765')
NGROK_URL = os.environ.get('MEETING_ID_API', 'http://localhost:8080/meeting-id')
REACT_WEBSOCKET_PORT = int(os.environ.get('REACT_WEBSOCKET_PORT', 8766))
FRAME_INTERVAL = float(os.environ.get('FRAME_INTERVAL', 1/30))  # Default 30 FPS
BROADCAST_INTERVAL = float(os.environ.get('BROADCAST_INTERVAL', 0.05))  # Default 20 updates/sec


# Global meeting variable
meeting: Meeting = None

# Track active processors for cleanup
active_processors = set()

# Global set to store connected React clients
react_clients = set()

#########################
# MEETING ID AUTOMATION #
#########################

async def get_meeting_id():
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(NGROK_URL) as response:
                data = await response.json()
                meeting_id = data.get("meetingId")
                if meeting_id:
                    print(f"Retrieved meeting ID: {meeting_id}")
                    return meeting_id
                else:
                    print(f"No meeting ID available: {data}")
                    return None
        except Exception as e:
            print(f"Error fetching meeting ID: {e}")
            return None

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
                    # Clean up any processing resources
                    for processor in active_processors:
                        await processor.cleanup()
                    active_processors.clear()
                
                current_meeting_id = new_meeting_id
                meeting_config = MeetingConfig(
                    meeting_id=new_meeting_id,
                    name='AI_MODEL',
                    mic_enabled=False,
                    webcam_enabled=False,
                    token=VIDEOSDK_TOKEN,
                )
                meeting = VideoSDK.init_meeting(**meeting_config)
                meeting.add_event_listener(SimpleEventHandler())
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
                # Clean up any processing resources
                for processor in active_processors:
                    await processor.cleanup()
                active_processors.clear()
                current_meeting_id = None
                meeting = None
        await asyncio.sleep(5)

##############################################
# REACT WEBSOCKET SERVER                     #
##############################################

async def handle_react_client(websocket: websockets.WebSocketServerProtocol):
    print(f"React client connected from {websocket.remote_address}")
    react_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        react_clients.remove(websocket)

async def start_react_server():
    port = REACT_WEBSOCKET_PORT
    async with websockets.serve(handle_react_client, "0.0.0.0", port):
        print(f"React WebSocket server running on port {port}")
        await asyncio.Future()

async def broadcast_predictions(predictions):
    if not react_clients:
        return
    message = json.dumps({
        "status": "success",
        "predictions": predictions
    })
    send_tasks = [asyncio.create_task(ws.send(message)) for ws in list(react_clients)]
    if send_tasks:
        await asyncio.gather(*send_tasks, return_exceptions=True)

##############################################
# VIDEO/ML PROCESSOR                         #
##############################################

class VideoProcessor:
    def __init__(self) -> None:
        self.ml_websocket: Optional[websockets.WebSocketClientProtocol] = None
        self.last_process_time = 0
        self.frame_interval = FRAME_INTERVAL
        self.last_predictions = []
        self.is_processing = False
        self.processing_task = None
        self.current_frame = None
        self.frame_ready = asyncio.Event()
        self.last_broadcast_time = 0
        self.broadcast_interval = BROADCAST_INTERVAL
    
    async def start(self):
        """Initialize and start processing"""
        self.is_processing = True
        active_processors.add(self)
        # Connect to ML server first
        await self.ensure_ml_connection()
        # Start frame processing loop
        self.processing_task = asyncio.create_task(self.process_frames())
    
    async def cleanup(self):
        """Clean up resources"""
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
                self.ml_websocket = await websockets.connect(ML_WEBSOCKET_URL)
                print(f"Connected to ML server at {ML_WEBSOCKET_URL}")
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
                # Convert frame to jpg
                _, buffer = cv2.imencode('.jpg', self.current_frame, 
                                         [cv2.IMWRITE_JPEG_QUALITY, 95,
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
                    current_time = time()
                    
                    # Always broadcast empty predictions to clear UI
                    if not predictions and self.last_predictions:
                        await broadcast_predictions([])
                        print("Broadcasting empty predictions to clear UI")
                        self.last_predictions = []
                    # For non-empty predictions, limit broadcast rate to reduce UI lag
                    elif predictions and (predictions != self.last_predictions or 
                                         current_time - self.last_broadcast_time >= self.broadcast_interval):
                        self.last_predictions = predictions
                        self.last_broadcast_time = current_time
                        await broadcast_predictions(predictions)
                        if predictions:  # Guard against empty list
                            print(f"Broadcasting prediction: {predictions[0]['gesture']} with confidence {predictions[0]['confidence']:.2f}")
                
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
        self.processor = VideoProcessor()
        # Start the processor
        asyncio.create_task(self.processor.start())

    async def recv(self):
        frame = await self.track.recv()
        return await self.processor.process(frame)

##############################################
# SIMPLIFIED EVENT HANDLERS                  #
##############################################

class SimpleEventHandler(MeetingEventHandler):
    def on_participant_joined(self, participant: Participant):
        # Just add an event listener to detect when video is enabled
        participant.add_event_listener(SimpleParticipantHandler())

class SimpleParticipantHandler(ParticipantEventHandler):
    def on_stream_enabled(self, stream: Stream):
        # Only process video streams
        if stream.kind == "video":
            print(f"Processing video stream from participant")
            meeting.add_custom_video_track(
                track=ProcessedVideoTrack(track=stream.track)
            )

##############################################
# MAIN FUNCTION                              #
##############################################

async def main():
    monitor_task = None
    react_server_task = None
    try:
        # Start the meeting ID monitor
        monitor_task = asyncio.create_task(monitor_meeting())
        
        # Start the React WebSocket server
        react_server_task = asyncio.create_task(start_react_server())
        
        # Wait indefinitely
        await asyncio.Event().wait()
    except Exception as e:
        print(f"Error in main: {e}")
    finally:
        print("Cleaning up...")
        # Cancel background tasks
        if monitor_task:
            monitor_task.cancel()
        if react_server_task:
            react_server_task.cancel()
            
        # Leave meeting if active
        if meeting:
            meeting.leave()
            
        # Clean up processors
        for processor in active_processors:
            await processor.cleanup()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down...")
    except Exception as e:
        print(f"Fatal error: {e}")