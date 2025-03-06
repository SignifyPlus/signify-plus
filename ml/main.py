import asyncio
import json
import socket
from aiohttp import web

CURRENT_MEETING_ID = None  # Global variable to store the meeting ID

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception as e:
        print("Error getting local IP:", e)
        return "0.0.0.0"

LOCAL_IP = get_local_ip()
print(f"✅ Detected Local IP: {LOCAL_IP}")

# HTTP handler to return the local IP (GET /local-ip)
async def get_local_ip_handler(request):
    return web.json_response({'localIP': LOCAL_IP})

# HTTP handler to receive the meeting ID (POST /meeting-id)
async def post_meeting_id_handler(request):
    global CURRENT_MEETING_ID 
    try:
        payload = await request.json()
        meeting_id = payload.get("meetingId")
        CURRENT_MEETING_ID = meeting_id
        print(f"📞 Received Meeting ID: {meeting_id}")
        return web.json_response({'status': 'success'})
    except Exception as e:
        print("Error processing meeting ID:", e)
        return web.json_response({'status': 'error'}, status=400)

async def get_meeting_id_handler(request):
    if CURRENT_MEETING_ID:
        return web.json_response({'meetingId': CURRENT_MEETING_ID})
    else:
        return web.json_response({'error': 'No meeting ID available'}, status=404)

async def start_http_server():
    app = web.Application()
    app.router.add_get('/local-ip', get_local_ip_handler)
    app.router.add_post('/meeting-id', post_meeting_id_handler)
    app.router.add_get('/meeting-id', get_meeting_id_handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 8080)
    await site.start()
    print("HTTP server running on port 8080")
    # Keep the server running indefinitely
    while True:
        await asyncio.sleep(3600)

async def main():
    await start_http_server()

if __name__ == "__main__":
    asyncio.run(main())