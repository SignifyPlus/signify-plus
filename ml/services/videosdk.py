import asyncio
import json
from base64 import b64encode
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
import cv2
from av import VideoFrame
import numpy as np
from time import time
from typing import Optional, Set
from contextlib import suppress
import os
import dotenv
from fastapi import WebSocket
from collections import deque
import time

dotenv.load_dotenv()

VIDEOSDK_TOKEN = os.environ.get('VIDEOSDK_TOKEN')
FRAME_INTERVAL = float(os.environ.get('FRAME_INTERVAL', 1/30))  # Default 30 FPS
BROADCAST_INTERVAL = float(os.environ.get('BROADCAST_INTERVAL', 0.05))  # Default 20 updates/sec


class VideoProcessor:
    def __init__(self, videosdk_service) -> None:
        self.videosdk_service = videosdk_service
        self.last_process_time = 0
        self.frame_interval = FRAME_INTERVAL
        self.current_frame = None
        self.frame_ready = asyncio.Event()
        self.is_processing = False
        self.processing_task = None

        # Adaptive frame rate control
        self.min_interval = float(os.environ.get('MIN_FRAME_INTERVAL', 1/45))  # Max ~45 FPS
        self.max_interval = float(os.environ.get('MAX_FRAME_INTERVAL', 1/15))  # Min ~15 FPS
        self.device_performance_factor = 1.0  # Will be adjusted based on observed performance

        # Frame rate tracking
        self.frame_times = deque(maxlen=100)  # Store last 100 frame timestamps
        self.frame_intervals = deque(maxlen=30)  # Store recent intervals
        self.average_fps = 0
        self.fps_update_interval = 3.0  # Update FPS every 3 seconds
        self.last_fps_update_time = time.time()
        self.device_speed_assessed = False
        
        # Frame drop monitoring
        self.dropped_frames = 0
        self.total_frames = 0

    async def start(self):
        """Initialize and start processing"""
        self.is_processing = True
        self.processing_task = asyncio.create_task(self.process_frames())
        # Start a separate task to periodically log FPS
        self.fps_task = asyncio.create_task(self.log_fps())
        
        # Start adaptive frame rate controller
        self.adaptive_task = asyncio.create_task(self.adaptive_framerate_controller())

    async def adaptive_framerate_controller(self):
        """Dynamically adjust frame rate based on device performance"""
        # Wait for initial device performance assessment
        await asyncio.sleep(5.0)  # Give some time to collect performance data
        while self.is_processing:
            try:
                if len(self.frame_intervals) >= 10:
                    # Calculate average processing time
                    avg_interval = sum(self.frame_intervals) / len(self.frame_intervals)

                    # Calculate frame drop rate
                    drop_rate = self.dropped_frames / max(1, self.total_frames)

                    # Adjust frame interval based on performance
                    if drop_rate > 0.2 or avg_interval > self.frame_interval * 1.5:
                        # Too many drops or processing too slow - reduce frame rate
                        new_interval = min(self.frame_interval * 1.2, self.max_interval)
                        if new_interval != self.frame_interval:
                            self.frame_interval = new_interval
                            print(f"⚠️ Reducing frame rate due to performance issues. New interval: {self.frame_interval:.4f}s")
                    elif drop_rate < 0.05 and avg_interval < self.frame_interval * 0.7:
                        # Good performance - can increase frame rate
                        new_interval = max(self.frame_interval * 0.9, self.min_interval)
                        if new_interval != self.frame_interval:
                            self.frame_interval = new_interval
                            print(f"✅ Increasing frame rate due to good performance. New interval: {self.frame_interval:.4f}s")
                    # Mark device speed as assessed
                    if not self.device_speed_assessed:
                        if drop_rate < 0.1:
                            print(f"📱 Device performance assessment: Good (drop rate: {drop_rate:.2f})")
                        else:
                            print(f"📱 Device performance assessment: Limited (drop rate: {drop_rate:.2f})")
                        self.device_speed_assessed = True
                    # Reset counters periodically
                    self.dropped_frames = 0
                    self.total_frames = 0
            except Exception as e:
                print(f"Error in adaptive framerate controller: {e}")
            await asyncio.sleep(3.0)  # Check every 3 seconds

    async def log_fps(self):
        """Periodically calculate and log average FPS"""
        while self.is_processing:
            await asyncio.sleep(self.fps_update_interval)
            if len(self.frame_times) > 1:
                # Calculate FPS based on the time between first and last frame
                time_span = self.frame_times[-1] - self.frame_times[0]
                num_frames = len(self.frame_times)
                
                if time_span > 0:
                    self.average_fps = (num_frames - 1) / time_span
                    print(f"Average FPS: {self.average_fps:.2f}, Target interval: {self.frame_interval:.4f}s")
            elif self.frame_times:
                print("Not enough frames to calculate FPS")

    async def cleanup(self):
        """Clean up resources"""
        self.is_processing = False
        if self.processing_task:
            self.processing_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.processing_task
        
         # Cancel FPS logging task
        if hasattr(self, 'fps_task'):
            self.fps_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.fps_task

        # Cancel adaptive controller task
        if hasattr(self, 'adaptive_task'):
            self.adaptive_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.adaptive_task
    
    async def process_frames(self):
        """Continuous frame processing loop"""
        while self.is_processing:
            await self.frame_ready.wait()
            self.frame_ready.clear()
            
            if self.current_frame is None:
                continue

            try:
                # Record frame time for FPS calculation
                current_time = time.time()
                self.frame_times.append(current_time)

                # Record processing interval if we have previous frames
                if len(self.frame_times) > 1:
                    interval = self.frame_times[-1] - self.frame_times[-2]
                    self.frame_intervals.append(interval)

                # Convert frame to jpg for ML processing
                _, buffer = cv2.imencode('.jpg', self.current_frame, 
                                        [cv2.IMWRITE_JPEG_QUALITY, 95,
                                         cv2.IMWRITE_JPEG_OPTIMIZE, 1])
                frame_data = b64encode(buffer).decode('utf-8')
                
                # Send frame to the ML WebSocket service
                await self.videosdk_service.send_frame_to_ml(frame_data)
                
            except Exception as e:
                print(f"Error in frame processing: {e}")
                await asyncio.sleep(0.1)
    
    async def process(self, frame: VideoFrame) -> VideoFrame:
        """Process incoming video frames"""
        self.total_frames += 1
        current_time = time.time()
        if current_time - self.last_process_time >= self.frame_interval:
            try:
                self.current_frame = frame.to_ndarray(format="bgr24")
                self.frame_ready.set()
                self.last_process_time = current_time
            except Exception as e:
                print(f"Error processing frame: {e}")
        else:
            # Frame dropped due to rate limiting
            self.dropped_frames += 1
        return frame


class ProcessedVideoTrack(CustomVideoTrack):
    def __init__(self, track, videosdk_service):
        super().__init__()
        self.track = track
        self.processor = VideoProcessor(videosdk_service)
        # Start the processor
        asyncio.create_task(self.processor.start())

    async def recv(self):
        frame = await self.track.recv()
        return await self.processor.process(frame)


class SimpleEventHandler(MeetingEventHandler):
    def __init__(self, videosdk_service):
        self.videosdk_service = videosdk_service
        
    def on_participant_joined(self, participant: Participant):
        # Just add an event listener to detect when video is enabled
        participant.add_event_listener(SimpleParticipantHandler(self.videosdk_service))


class SimpleParticipantHandler(ParticipantEventHandler):
    def __init__(self, videosdk_service):
        self.videosdk_service = videosdk_service
        
    def on_stream_enabled(self, stream: Stream):
        # Only process video streams
        if stream.kind == "video" and self.videosdk_service.meeting:
            print(f"Processing video stream from participant")
            self.videosdk_service.meeting.add_custom_video_track(
                track=ProcessedVideoTrack(track=stream.track, videosdk_service=self.videosdk_service)
            )


class VideoSDKService:
    def __init__(self):
        self.meeting: Optional[Meeting] = None
        self.meeting_id: Optional[str] = None
        self.react_clients: Set[WebSocket] = set()
        self.active_processors = set()
        self.last_predictions = []
        self.last_broadcast_time = 0
        self.broadcast_interval = BROADCAST_INTERVAL
        self.ml_websocket: Optional[WebSocket] = None
        self.ml_queue = asyncio.Queue()
        self.is_running = False
        self.monitor_task = None
        self.processor_task = None
    
    async def initialize_ml_client(self):
        """Connect to ML server via FastAPI endpoint"""
        # This will be handled by the FastAPI app
        pass
    
    def add_react_client(self, websocket: WebSocket):
        """Add a React client WebSocket connection"""
        self.react_clients.add(websocket)
        print(f"React client connected, total clients: {len(self.react_clients)}")
    
    def remove_react_client(self, websocket: WebSocket):
        """Remove a React client WebSocket connection"""
        self.react_clients.discard(websocket)
        print(f"React client disconnected, remaining clients: {len(self.react_clients)}")
    
    async def broadcast_predictions(self, predictions):
        """Broadcast predictions to all connected React clients"""
        if not self.react_clients:
            return
            
        message = json.dumps({
            "status": "success",
            "predictions": predictions
        })
        
        # Create tasks for sending to each client
        for ws in list(self.react_clients):
            try:
                await ws.send_text(message)
            except Exception as e:
                print(f"Error sending to React client: {e}")
                self.react_clients.discard(ws)
    
    async def send_frame_to_ml(self, frame_data):
        """Send a frame to the ML service for processing"""
        await self.ml_queue.put(frame_data)
    
    async def handle_ml_results(self, results):
        """Process ML inference results"""
        if results.get("status") == "success":
            predictions = results.get("predictions", [])
            current_time = time.time()
            
            # Always broadcast empty predictions to clear UI
            if not predictions and self.last_predictions:
                await self.broadcast_predictions([])
                print("Broadcasting empty predictions to clear UI")
                self.last_predictions = []
            # For non-empty predictions, limit broadcast rate to reduce UI lag
            elif predictions and (predictions != self.last_predictions or 
                                 current_time - self.last_broadcast_time >= self.broadcast_interval):
                self.last_predictions = predictions
                self.last_broadcast_time = current_time
                await self.broadcast_predictions(predictions)
                if predictions:  # Guard against empty list
                    print(f"Broadcasting prediction: {predictions[0]['gesture']} with confidence {predictions[0]['confidence']:.2f}")
    
    async def ml_processor(self):
        """Process frames from the queue and send them to ML service"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            # Use localhost for internal communication
            ml_url = "http://localhost:8080/ws/inference"
            
            async with session.ws_connect(ml_url) as ws:
                self.ml_websocket = ws
                print("Connected to ML inference service")
                
                # Start a task to handle responses
                async def handle_responses():
                    async for msg in ws:
                        if msg.type == aiohttp.WSMsgType.TEXT:
                            data = json.loads(msg.data)
                            await self.handle_ml_results(data)
                        elif msg.type == aiohttp.WSMsgType.ERROR:
                            print(f"ML WebSocket connection closed with error: {ws.exception()}")
                            break
                
                response_task = asyncio.create_task(handle_responses())
                
                try:
                    while self.is_running:
                        try:
                            # Get frame from queue with timeout
                            frame_data = await asyncio.wait_for(self.ml_queue.get(), timeout=1.0)
                            
                            # Send to ML service
                            await ws.send_json({
                                "type": "frame",
                                "data": frame_data
                            })
                            
                        except asyncio.TimeoutError:
                            # No frames in queue, just continue
                            continue
                        except Exception as e:
                            print(f"Error in ML processing: {e}")
                            await asyncio.sleep(0.1)
                finally:
                    response_task.cancel()
                    with suppress(asyncio.CancelledError):
                        await response_task
    
    async def update_meeting_id(self, meeting_id: str):
        """Update the current meeting ID and join if necessary"""
        if meeting_id == self.meeting_id:
            print("Meeting ID unchanged")
            return
        
        # If we're in a meeting, leave it
        if self.meeting is not None:
            print("Leaving current meeting...")
            self.meeting.leave()
            
            # Clean up any processing resources
            for processor in self.active_processors:
                await processor.cleanup()
            self.active_processors.clear()
        
        # Join new meeting
        self.meeting_id = meeting_id
        meeting_config = MeetingConfig(
            meeting_id=meeting_id,
            name='AI_MODEL',
            mic_enabled=False,
            webcam_enabled=False,
            token=VIDEOSDK_TOKEN,
        )
        self.meeting = VideoSDK.init_meeting(**meeting_config)
        self.meeting.add_event_listener(SimpleEventHandler(self))
        print(f"Joining new meeting: {meeting_id}")
        self.meeting.join()
    
    async def start_monitoring(self):
        """Start the VideoSDK service monitoring"""
        self.is_running = True
        
        # Start the ML processor task
        self.processor_task = asyncio.create_task(self.ml_processor())
        
        print("VideoSDK service started")
    
    async def cleanup(self):
        """Clean up resources"""
        self.is_running = False
        
        # Stop any running tasks
        if self.processor_task:
            self.processor_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.processor_task
        
        # Leave meeting if active
        if self.meeting:
            self.meeting.leave()
            self.meeting = None
        
        # Clean up processors
        for processor in self.active_processors:
            await processor.cleanup()
        self.active_processors.clear()
        
        print("VideoSDK service stopped")