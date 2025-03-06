# Merged WebSocket server script combining Keras inference and VideoSDK integration.
# - Sets up a single WebSocket server on port 8766 for both video frame input and UI clients.
# - Maintains Keras model inference functionality (from testtestkeras.py).
# - Integrates VideoSDK meeting monitoring and custom video track processing (from videosdk_sender.py).
# - Ensures efficient WebSocket communication between video source and inference, and broadcasts to UI.
# - Compatible with main.py for retrieving meeting IDs (by querying its HTTP endpoint if needed).
# - Properly handles connection establishment, message processing, and disconnections for all clients.

import asyncio
import json
import websockets
import cv2
import numpy as np
from av import VideoFrame
from base64 import b64encode, b64decode
import tensorflow as tf
import mediapipe as mp
from typing import Set, Optional, List
from time import time
from contextlib import suppress

# VideoSDK imports
from videosdk import MeetingConfig, VideoSDK, Participant, Stream, MeetingEventHandler, ParticipantEventHandler, CustomVideoTrack, Meeting
import aiohttp

# Configuration constants
PORT = 8766  # Common WebSocket server port for all components
# VideoSDK token (replace with a valid token as needed)
VIDEOSDK_TOKEN = "eyJh...<YOUR_TOKEN_HERE>...Wwl4c"
# Endpoint for meeting ID retrieval (ensure main.py is running or adjust URL as needed)
MEETING_ID_URL = "https://moving-cardinal-happily.ngrok-free.app/meeting-id"

# Global variables
meeting: Optional[Meeting] = None  # VideoSDK Meeting object (managed by monitor_meeting)
ui_clients: Set[websockets.WebSocketServerProtocol] = set()  # Connected UI client WebSocket connections
last_broadcast_predictions: List[dict] = []  # Last predictions broadcast to UI (to avoid duplicate sends)

# Keras model and MediaPipe setup for inference
class KerasModelInference:
    def __init__(self, model_path="C:\\signify-plus\\ml\\models_cache\\model.keras"):
        # Load the trained Keras model and initialize MediaPipe
        self.model = tf.keras.models.load_model(model_path)
        print("✅ Keras model loaded successfully.")
        self.class_names = [
            "welcome", "we", "happy", "you", "here",
            "today", "topic", "c", "t", "i", "s"
        ]
        self.sequence_length = 30  # Model expects 30 timesteps
        self.sequence_buffer: List[np.ndarray] = []  # Buffer to accumulate feature vectors
        # Initialize MediaPipe Hands for feature extraction
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=0
        )
        print("🖐️ MediaPipe Hands initialized for feature extraction.")

    def extract_features(self, frame: np.ndarray) -> np.ndarray:
        """
        Extract a 99-dimensional feature vector from a video frame using MediaPipe Hands.
        Returns a 99-length NumPy array of features (or zeros if no hand is detected).
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            # Use the first detected hand to generate features
            hand_landmarks = results.multi_hand_landmarks[0]
            joint = np.zeros((21, 4), dtype=np.float32)
            for j, lm in enumerate(hand_landmarks.landmark):
                joint[j] = [lm.x, lm.y, lm.z, lm.visibility]
            # Compute bone vectors and angles between them (replicating dataset logic)
            idx1 = [0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19]
            idx2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            v1 = joint[idx1, :3]
            v2 = joint[idx2, :3]
            v = v2 - v1
            # Normalize vectors to unit length to compute angles
            v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
            # Select vector pairs for angle calculation
            idx_angle1 = [0,1,2,4,5,6,8,9,10,12,13,14,16,17,18]
            idx_angle2 = [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19]
            v_angle1 = v[idx_angle1]
            v_angle2 = v[idx_angle2]
            # Compute dot products and angles (in degrees) between corresponding vectors
            dot = np.einsum('ij,ij->i', v_angle1, v_angle2)
            dot = np.clip(dot, -1.0, 1.0)
            angles = np.degrees(np.arccos(dot))
            # Concatenate joint coordinates (21*4=84 values) with angles (15 values) -> 99 features
            feature_vector = np.concatenate([joint.flatten(), angles])
            return feature_vector
        else:
            # No hand detected in frame, return a zero-vector of length 99
            return np.zeros(99, dtype=np.float32)

    async def process_frame(self, frame: np.ndarray) -> List[dict]:
        """
        Process an incoming frame:
        - Extract features, add to sequence buffer.
        - Once 30 frames are accumulated, run model prediction on the sequence.
        Returns a list of prediction results (empty list if not enough frames yet).
        """
        try:
            features = self.extract_features(frame)
            self.sequence_buffer.append(features)
            # If not enough frames yet, do not run inference
            if len(self.sequence_buffer) < self.sequence_length:
                return []
            # Use the last 30 frames for inference
            seq = self.sequence_buffer[-self.sequence_length:]
            input_sequence = np.array(seq, dtype=np.float32)  # shape (30, 99)
            input_tensor = np.expand_dims(input_sequence, axis=0)  # shape (1, 30, 99)
            predictions = self.model.predict(input_tensor)
            return self.postprocess(predictions)
        except Exception as e:
            # Log inference errors and continue
            print(f"⚠️ Error during inference: {e}")
            return []

    def postprocess(self, predictions: np.ndarray) -> List[dict]:
        """
        Convert model output to a human-readable prediction.
        Returns the top prediction (action label and confidence) as a list containing one dict.
        """
        if predictions is None or len(predictions) == 0:
            return []
        probs = predictions[0]
        class_id = int(np.argmax(probs))
        confidence = float(probs[class_id])
        action_label = self.class_names[class_id] if class_id < len(self.class_names) else "unknown"
        print(f"🤖 Predicted action: {action_label} (confidence: {confidence:.2f})")
        return [{"action": action_label, "confidence": confidence}]

# Initialize the Keras model inference engine (load model once at startup)
inference_engine = KerasModelInference()

async def handle_ws_client(websocket: websockets.WebSocketServerProtocol, path: str):
    """
    Handle a new WebSocket client connection (either video source or UI client).
    - Video source clients send frames (JSON with type "frame" and base64 data) and receive predictions.
    - UI clients simply receive broadcast prediction messages.
    """
    # Register all new connections as UI clients initially (they will remain if they don't send frames)
    ui_clients.add(websocket)
    print(f"⚡ New WebSocket client connected from {websocket.remote_address}. Total clients: {len(ui_clients)}")
    try:
        async for message in websocket:
            data = None
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                # If message is not JSON, ignore it (could be ping/pong or irrelevant data)
                continue

            # If this client sends a frame, treat it as the video source (remove from ui_clients if present)
            if data.get("type") == "frame":
                if websocket in ui_clients:
                    ui_clients.remove(websocket)
                # Decode the base64 image data to a frame
                jpg_bytes = b64decode(data.get("data", ""))
                frame_array = np.frombuffer(jpg_bytes, np.uint8)
                frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
                # Run the model inference on the frame
                predictions = await inference_engine.process_frame(frame)
                # Prepare response message
                response = {"status": "success", "predictions": predictions}
                # Send predictions back to the video source client
                try:
                    await websocket.send(json.dumps(response))
                except Exception as send_err:
                    print(f"⚠️ Error sending inference result to source client: {send_err}")
                # Broadcast predictions to all other connected UI clients when predictions update
                if predictions and predictions != last_broadcast_predictions:
                    last_broadcast_predictions.clear()
                    last_broadcast_predictions.extend(predictions)
                    if ui_clients:
                        broadcast_msg = json.dumps(response)
                        send_tasks = []
                        for ui_ws in list(ui_clients):
                            try:
                                send_tasks.append(asyncio.create_task(ui_ws.send(broadcast_msg)))
                            except Exception:
                                # Remove any clients that cannot be reached
                                ui_clients.discard(ui_ws)
                        if send_tasks:
                            await asyncio.gather(*send_tasks, return_exceptions=True)
            else:
                # Handle other message types if necessary (e.g., UI clients might send a registration message)
                # Currently, UI clients are read-only, so we ignore any incoming messages from them.
                pass
    except websockets.exceptions.ConnectionClosed:
        print(f"🔌 Client disconnected: {websocket.remote_address}")
    finally:
        # Remove the websocket from UI clients (safe to call even if not present)
        ui_clients.discard(websocket)

# VideoSDK integration: Monitor meeting IDs and join/leave meetings
async def get_meeting_id():
    """
    Retrieve the current meeting ID from the designated source (main.py or external API).
    Attempts to fetch the meeting ID from MEETING_ID_URL.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(MEETING_ID_URL) as response:
                data = await response.json()
                meeting_id = data.get("meetingId")
                if meeting_id:
                    print(f"🔎 Retrieved meeting ID: {meeting_id}")
                    return meeting_id
                else:
                    # meetingId not yet available
                    return None
    except Exception as e:
        print(f"⚠️ Failed to get meeting ID: {e}")
        return None

async def monitor_meeting():
    """
    Background task to monitor changes in meeting ID (from main.py or external service).
    Joins a new meeting when a new meeting ID is found, and leaves the previous meeting if it changes or ends.
    """
    global meeting
    current_meeting_id = None
    while True:
        new_meeting_id = await get_meeting_id()
        if new_meeting_id:
            if current_meeting_id is None or new_meeting_id != current_meeting_id:
                print(f"📢 New meeting ID detected: {new_meeting_id}")
                # If currently in a meeting, leave it and clean up tracks
                if meeting is not None:
                    print("👋 Leaving current meeting...")
                    meeting.leave()
                    # Stop any custom video tracks (to stop frame processing tasks)
                    for participant in list(meeting.participants.values()):
                        for stream in list(participant.streams.values()):
                            if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                                await stream.track.stop()
                    meeting = None
                # Update to new meeting ID and join the meeting
                current_meeting_id = new_meeting_id
                meeting_config = MeetingConfig(
                    meeting_id=new_meeting_id,
                    name="AI_MODEL",
                    mic_enabled=False,
                    webcam_enabled=False,
                    token=VIDEOSDK_TOKEN
                )
                meeting = VideoSDK.init_meeting(**meeting_config)
                meeting.add_event_listener(MyMeetingEventHandler())
                print("🚪 Joining meeting...")
                meeting.join()  # Join the meeting (VideoSDK may handle this asynchronously)
            else:
                # Meeting ID unchanged, nothing to do
                pass
        else:
            # No meeting ID available
            print("ℹ️ No meeting ID available currently.")
            # If we had an active meeting and now there's none, leave the current meeting
            if meeting is not None:
                print("⚠️ Meeting ID became unavailable, leaving current meeting...")
                meeting.leave()
                for participant in list(meeting.participants.values()):
                    for stream in list(participant.streams.values()):
                        if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                            await stream.track.stop()
                meeting = None
                current_meeting_id = None
        await asyncio.sleep(5)  # Poll every 5 seconds

# Custom video track processing classes for VideoSDK
class OptimizedWebSocketProcessor:
    """
    Attaches to a VideoSDK video track to send frames to the ML WebSocket server and handle responses.
    """
    def __init__(self):
        self.ml_websocket: Optional[websockets.WebSocketClientProtocol] = None
        self.last_process_time = 0
        self.frame_interval = 1/2  # Process at most 2 frames per second to reduce load
        self.is_processing = False
        self.processing_task: Optional[asyncio.Task] = None
        self.current_frame = None
        self.frame_ready_event = asyncio.Event()

    async def ensure_ml_connection(self):
        """
        Ensure that a connection to the local ML WebSocket server (inference engine) is established.
        Retries until successful or until processing is stopped.
        """
        while self.is_processing and (self.ml_websocket is None or self.ml_websocket.closed):
            try:
                self.ml_websocket = await websockets.connect(f"ws://localhost:{PORT}")
                print(f"✅ Connected to ML WebSocket server on port {PORT}")
                return True
            except Exception as e:
                # Connection failed, retry after a short delay
                print(f"🔄 ML server connection failed, retrying... ({e})")
                await asyncio.sleep(0.5)
        return False

    async def start(self):
        """
        Start the frame processing loop. Ensures connection to the ML server and begins processing frames.
        """
        self.is_processing = True
        # Connect to the ML inference server
        await self.ensure_ml_connection()
        # Start a background task to continuously process frames
        self.processing_task = asyncio.create_task(self.process_frames())
        print("🎥 Started frame processing loop.")

    async def process_frames(self):
        """
        Continuously process frames from the video track and send them to the ML server.
        Runs until is_processing is set to False.
        """
        while self.is_processing:
            # Wait for a frame to be ready for processing
            await self.frame_ready_event.wait()
            self.frame_ready_event.clear()
            if not self.is_processing:
                break  # Exit if processing was stopped
            if self.current_frame is None:
                continue
            # Ensure the ML server connection is alive (reconnect if needed)
            if not self.ml_websocket or self.ml_websocket.closed:
                if not await self.ensure_ml_connection():
                    continue  # Skip this frame if unable to connect
            try:
                # Encode the frame to JPEG (with moderate quality for speed) and send to inference server
                _, buffer = cv2.imencode('.jpg', self.current_frame, [
                    cv2.IMWRITE_JPEG_QUALITY, 80,
                    cv2.IMWRITE_JPEG_PROGRESSIVE, 0,
                    cv2.IMWRITE_JPEG_OPTIMIZE, 1
                ])
                frame_data = b64encode(buffer).decode('utf-8')
                await self.ml_websocket.send(json.dumps({"type": "frame", "data": frame_data}))
                # Await the inference result
                response = await self.ml_websocket.recv()
                result = json.loads(response)
                if result.get("status") != "success":
                    # If an error status is returned by the inference server, log it
                    print(f"⚠️ ML server returned error: {result.get('message')}")
                # (No UI broadcast here; the server itself handles broadcasting to UI clients)
            except Exception as e:
                # On error, close the ML connection and attempt reconnect on next iteration
                print(f"⚠️ Error during frame send/receive: {e}")
                if self.ml_websocket:
                    with suppress(Exception):
                        await self.ml_websocket.close()
                self.ml_websocket = None
                await asyncio.sleep(0.1)
    
    async def process(self, frame: VideoFrame) -> VideoFrame:
        """
        Process an incoming VideoSDK video frame. Throttles frame sending based on frame_interval.
        Returns the original frame (unmodified) to continue the video pipeline.
        """
        current_time = time()
        # Throttle frame processing to avoid sending too many frames
        if current_time - self.last_process_time >= self.frame_interval:
            try:
                # Convert VideoFrame to numpy array (BGR24 format)
                self.current_frame = frame.to_ndarray(format="bgr24")
                # Signal that a new frame is ready for processing
                self.frame_ready_event.set()
                self.last_process_time = current_time
            except Exception as e:
                print(f"⚠️ Error converting frame: {e}")
        # Return the frame (unmodified) to let VideoSDK continue streaming
        return frame

    async def cleanup(self):
        """
        Stop processing and clean up resources. Closes the ML WebSocket connection and stops the processing task.
        """
        self.is_processing = False
        # Close ML websocket if open
        try:
            if self.ml_websocket:
                await self.ml_websocket.close()
        except Exception as e:
            print(f"⚠️ Error closing ML WebSocket: {e}")
        # Cancel the processing task if it exists
        if self.processing_task:
            self.processing_task.cancel()
            with suppress(asyncio.CancelledError):
                await self.processing_task
        print("🛑 Stopped frame processing.")

class ProcessedVideoTrack(CustomVideoTrack):
    """
    Custom VideoTrack that wraps a participant's video track and sends frames to the ML processor.
    """
    def __init__(self, track):
        super().__init__()
        self.track = track  # original video track from VideoSDK
        self.processor = OptimizedWebSocketProcessor()
        # Start the background frame processing task for this track
        asyncio.create_task(self.processor.start())

    async def recv(self):
        """
        Fetch the next video frame from the original track, process it, and return it.
        """
        frame = await self.track.recv()
        return await self.processor.process(frame)

    async def stop(self):
        """
        Clean up when this custom track is stopped (e.g., on meeting leave).
        """
        await self.processor.cleanup()

# Event handlers for meeting events
class MyMeetingEventHandler(MeetingEventHandler):
    def on_meeting_left(self, data):
        print("🔚 Left the meeting.")
    def on_participant_joined(self, participant: Participant):
        # When a participant joins, set up event handlers for their streams
        participant.add_event_listener(MyParticipantEventHandler(participant_id=participant.id))
    def on_participant_left(self, participant: Participant):
        print(f"👤 Participant left: {participant.id}")

class MyParticipantEventHandler(ParticipantEventHandler):
    def __init__(self, participant_id: str):
        super().__init__()
        self.participant_id = participant_id
    def on_stream_enabled(self, stream: Stream):
        print(f"🎦 Stream enabled ({stream.kind}) for participant {self.participant_id}")
        if stream.kind == "video":
            try:
                meeting.add_custom_video_track(track=ProcessedVideoTrack(track=stream.track))
                print(f"✅ Processing video track for participant {self.participant_id}")
            except Exception as e:
                print(f"⚠️ Failed to process video track: {e}")
    def on_stream_disabled(self, stream: Stream):
        print(f"🚫 Stream disabled ({stream.kind}) for participant {self.participant_id}")

# Main async entry point for the entire script
async def main_async():
    # Start the unified WebSocket server for both video source and UI clients
    server = await websockets.serve(handle_ws_client, "0.0.0.0", PORT)
    print(f"🚀 WebSocket server started on ws://0.0.0.0:{PORT}")
    # Start monitoring meeting IDs (VideoSDK integration) in the background
    monitor_task = asyncio.create_task(monitor_meeting())
    try:
        # Keep running indefinitely (until program is terminated)
        await asyncio.Future()  # Run forever
    finally:
        # On shutdown, cancel the monitor task and clean up VideoSDK meeting
        monitor_task.cancel()
        with suppress(asyncio.CancelledError):
            await monitor_task
        if meeting:
            try:
                # Stop any active processed video tracks
                for participant in list(meeting.participants.values()):
                    for stream in list(participant.streams.values()):
                        if hasattr(stream, 'track') and isinstance(stream.track, ProcessedVideoTrack):
                            await stream.track.stop()
                meeting.leave()
                print("🏁 Left meeting due to shutdown.")
            except Exception as e:
                print(f"⚠️ Error during shutdown cleanup: {e}")
        # Close the WebSocket server
        server.close()
        await server.wait_closed()
        print("🔒 WebSocket server closed.")

# Run the main async function when script is executed
if __name__ == "__main__":
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        print("🔻 Script interrupted by user, shutting down...")
    except Exception as e:
        print(f"💥 Fatal error: {e}")
