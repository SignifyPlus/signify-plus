# ML Server Documentation

## Overview
This server processes video frames for real-time sign language recognition using a TensorFlow model and MediaPipe. It integrates with VideoSDK for video meetings and communicates with React clients via WebSockets.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Components](#components)
  - [SignLanguageProcessor](#signlanguageprocessor)
  - [VideoProcessingTrack](#videoprocessingtrack)
  - [MeetingManager](#meetingmanager)
  - [MeetingEventHandler](#meetingeventhandler)
  - [ParticipantEventHandler](#participanteventhandler)
- [Running the Server](#running-the-server)
- [Error Handling](#error-handling)

---

## Installation

```sh
pip install asyncio websockets opencv-python numpy tensorflow mediapipe aiohttp videosdk av
```

Ensure you have the trained model at `./models_cache/best_model.keras`.

## Configuration

- **VIDEOSDK_TOKEN**: Token for VideoSDK authentication.
- **REACT_WS_PORT**: WebSocket port for React clients (default: `8766`).
- **NGROK_URL**: Public URL for meeting ID retrieval.

## Components

### SignLanguageProcessor
Handles frame processing and sign language recognition.

#### Methods
- `extract_features(frame: np.ndarray) -> np.ndarray`
  - Extracts a 99-dimensional feature vector using MediaPipe Hands.
- `process_frame(frame: np.ndarray) -> List[dict]`
  - Processes a frame, extracts features, and makes predictions.
- `postprocess(predictions: np.ndarray) -> List[dict]`
  - Returns the most likely action and confidence score.
- `start_react_server()`
  - Starts WebSocket server for React clients.
- `handle_react_client(websocket)`
  - Manages client connections.
- `broadcast_to_react_clients(predictions)`
  - Sends predictions to connected React clients.
- `start()`
  - Initializes the server.
- `cleanup()`
  - Cleans up resources.

### VideoProcessingTrack
Processes video frames for sign language detection.

#### Methods
- `recv()`
  - Receives frames and runs them through `SignLanguageProcessor`.

### MeetingManager
Handles meeting monitoring and participant management.

#### Methods
- `wait_for_meeting_id()`
  - Waits for an available meeting ID.
- `get_meeting_id()`
  - Fetches the meeting ID from `NGROK_URL`.
- `monitor_meeting()`
  - Monitors for meeting ID changes and joins/leaves accordingly.
- `start()`
  - Starts the meeting manager.
- `cleanup()`
  - Cleans up resources.

### MeetingEventHandler
Handles meeting-related events.

#### Methods
- `on_meeting_left(data)`
  - Logs when a meeting ends.
- `on_participant_joined(participant)`
  - Adds event listeners for participant events.
- `on_participant_left(participant)`
  - Logs when a participant leaves.

### ParticipantEventHandler
Handles individual participant events.

#### Methods
- `on_stream_enabled(stream)`
  - Processes video streams for sign language recognition.
- `on_stream_disabled(stream)`
  - Logs when a stream is disabled.
- `process_video(track)`
  - Applies `VideoProcessingTrack` to participant video streams.

## Running the Server

```sh
python ml_server.py
```

## Error Handling
- Errors during inference are logged but do not stop processing.
- WebSocket connection issues are handled gracefully.
- Unexpected errors in `main()` trigger cleanup before shutdown.

---

This documentation provides an overview of the ML server's structure and functionality. Modify the configurations as needed for your deployment.

