# Sign Language Detection System Setup

## Prerequisites
- Python 3.12
- Windows OS
- Ports 8765 and 8766 available

## Setup Instructions

### 1. Create Virtual Environments
```bash
# Create VideoSDK environment
python -m venv videosdkvenv
videosdkvenv/Scripts/activate


# Create Inference environment
python -m venv inferencevenv
inferencevenv/Scripts/activate
```

### 2. Install Dependencies

```bash
# In videosdkvenv
pip install videosdk websockets opencv-python av numpy

# In inferencevenv
pip install websockets opencv-python numpy onnxruntime
```

### 3. Configure Network

```bash
# Get your local IP
ipconfig

# Look for "IPv4 Address" under "Wireless LAN adapter Wi-Fi"
# Example: 192.168.1.100
```

### 4. Update Frontend Configuration

In your `video-call.tsx`, update the WebSocket connection:
```typescript
const ws = new WebSocket('ws://YOUR_LOCAL_IP:8766');
```

### 5. Configure VideoSDK
```bash
cd app
npx expo start
s
a
```
get meeting_id

In `videosdk_sender.py`, update:
```python
MEETING_ID = "your_meeting_id"
```

### 6. Run the System

Open three separate terminal windows:

Terminal 1 (Inference Server):
```bash
inferencevenv/Scripts/activate
python testtestONNX.py
```

Terminal 2 (VideoSDK):
```bash
videosdkvenv/Scripts/activate
python videosdk_sender.py
```

## Ports
- 8765: Inference Server
- 8766: WebSocket Server for React clients

## Troubleshooting

If ports are in use:
```bash
# Check ports
netstat -ano | findstr :8765
netstat -ano | findstr :8766

# Kill process if needed
taskkill /PID <process_id> /F
```