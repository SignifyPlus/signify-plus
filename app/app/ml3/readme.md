# Sign Language Detection System Setup

## Prerequisites
- Python 3.12
- Windows OS
- ngrok installed
- Ports 8080, 8765, and 8766 available

## Setup Instructions

### 1. Setup ngrok Server
Open an ngrok terminal and run the following command:
```bash
ngrok http --url=moving-cardinal-happily.ngrok-free.app 8080

#Replace moving-cardinal-happily.ngrok-free.app with your own URL from your ngrok dashboard. Also, update this URL in:

#videosdk_sender.py in the get_meeting_id() function.
#app-context.tsx in the sendMeetingIdToPython function
```

### 2. Connect Your Device

```bash
#To get your device ID, run:
adb devices

#Connect your device and set up port forwarding by running:
adb -s <your-device-id> reverse tcp:8766 tcp:8766

```

### 3.  Install Dependencies Globally

```bash
pip install videosdk websockets opencv-python av numpy aiohttp tensorflow mediapipe onnxruntime
```

### 4. Run the System

Open four separate terminal windows:

Terminal 1 (HTTP Meeting ID Server):
```bash
cd ml
python main.py
```

Terminal 2 (Inference Server):
```bash
cd ml
python testtestkeras.py
```

Terminal 3 (VideoSDK Sender):
```bash
cd ml
python videosdk_sender.py
```
Terminal 4 (Frontend App):
```bash
cd app
npx expo start
s
a
```

## Ports
8080: HTTP Meeting ID Server (ngrok forwards this)
8765: Inference Server
8766: Global WebSocket Server for React clients

## Troubleshooting

If ports are in use:
```bash
# Check ports
netstat -ano | findstr :8080
netstat -ano | findstr :8765
netstat -ano | findstr :8766

# Kill process if needed
taskkill /PID <process_id> /F

```
