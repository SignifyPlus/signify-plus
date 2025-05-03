import asyncio
import os
from typing import Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Import the services from their respective modules
from services.inference import KerasInferenceService
from services.videosdk import VideoSDKService
from fastapi import HTTPException
import os
# Load environment variables
load_dotenv()
SERVER_HOST = os.environ.get('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.environ.get('SERVER_PORT', 8080))

# Global meeting ID store
CURRENT_MEETING_ID = None

# Create FastAPI app
app = FastAPI(title="Sign Language Detection System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
inference_service = KerasInferenceService()
videosdk_service = VideoSDKService()

# Models for API requests
class MeetingIDPayload(BaseModel):
    meetingId: str

# Meeting ID endpoints
@app.post("/meeting-id")
async def post_meeting_id(payload: MeetingIDPayload):
    global CURRENT_MEETING_ID
    CURRENT_MEETING_ID = payload.meetingId
    print(f"📞 Received Meeting ID: {payload.meetingId}")
    
    # Notify the VideoSDK service about the new meeting ID
    await videosdk_service.update_meeting_id(payload.meetingId)
    
    return {"status": "success"}

@app.get("/meeting-id")
async def get_meeting_id():
    if CURRENT_MEETING_ID:
        return {"meetingId": CURRENT_MEETING_ID}
    else:
        return {"error": "No meeting ID available"}, 404
    
@app.post("/trigger-recording")
async def trigger_recording():
    if CURRENT_MEETING_ID is None:
        raise HTTPException(status_code=400, detail="No meeting ID available.")
    
    if not videosdk_service.active_processors:
        raise HTTPException(status_code=400, detail="No active video stream available for recording.")
    
    # Create the target directory if it does not exist.
    os.makedirs("mobile dataset", exist_ok=True)
    file_name = f"{CURRENT_MEETING_ID}_input.mp4"
    file_path = os.path.join("mobile dataset", file_name)
    
    # Pick one active video processor (e.g., the first one) and start recording.
    processor = next(iter(videosdk_service.active_processors))
    processor.start_recording(file_path, 30)  # recording for 30 seconds
    return {"status": "success", "message": f"Recording started. Saving to {file_path}."}

# ML Inference WebSocket endpoint
@app.websocket("/ws/inference")
async def inference_websocket(websocket: WebSocket):
    await websocket.accept()
    await inference_service.handle_client(websocket)

# React client WebSocket endpoint
@app.websocket("/ws/react")
async def react_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        # Register the client with the VideoSDK service
        videosdk_service.add_react_client(websocket)
        # Keep the connection open until client disconnects
        await websocket.receive_text()  # This will block until client disconnects
    except WebSocketDisconnect:
        pass
    finally:
        videosdk_service.remove_react_client(websocket)

# Start up tasks
@app.on_event("startup")
async def startup_event():
    # Start the VideoSDK monitoring in the background
    asyncio.create_task(videosdk_service.start_monitoring())
    
    # Start the ML inference service
    await inference_service.initialize()
    
    print(f"Server running on http://{SERVER_HOST}:{SERVER_PORT}")

# Shutdown tasks
@app.on_event("shutdown")
async def shutdown_event():
    await videosdk_service.cleanup()
    await inference_service.cleanup()

if __name__ == "__main__":
    import uvicorn
    import threading
    import os
    import requests  # Be sure to have requests installed: pip install requests

    def wait_for_recording():
        while True:
            input("Press Enter to start mobile video recording for 30 seconds...")
            try:
                # Call the new endpoint to trigger recording
                response = requests.post("http://localhost:8080/trigger-recording")
                if response.status_code == 200:
                    data = response.json()
                    print(data["message"])
                else:
                    print("Recording trigger failed:", response.json().get("detail", "Unknown error"))
            except Exception as e:
                print("Error triggering recording:", e)

    # Start the background thread that waits for input.
    input_thread = threading.Thread(target=wait_for_recording, daemon=True)
    input_thread.start()

    # Run uvicorn in the main thread with reload enabled.
    uvicorn.run("main:app", host=SERVER_HOST, port=SERVER_PORT, reload=True)


