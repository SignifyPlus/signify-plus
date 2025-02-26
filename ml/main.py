import asyncio
import json
import socket
from aiohttp import web

ACTIVE_MEETINGS = {}  # Format: {meeting_id: {"participants": [], "created_at": timestamp}}

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
print(f"✅ Detected Mac Local IP: {LOCAL_IP}")

# HTTP handler to return the local IP (GET /local-ip)
async def get_local_ip_handler(request):
    return web.json_response({'localIP': LOCAL_IP})

# Modified meeting ID handler
async def post_meeting_id_handler(request):
    try:
        payload = await request.json()
        meeting_id = payload.get("meetingId")
        action = payload.get("action", "create")  # create/end
        
        if action == "create":
            ACTIVE_MEETINGS[meeting_id] = {
                "participants": [],
                "created_at": time.time()
            }
            print(f"📞 New meeting started: {meeting_id}")
        elif action == "end":
            ACTIVE_MEETINGS.pop(meeting_id, None)
            print(f"📞 Meeting ended: {meeting_id}")
            
        return web.json_response({'status': 'success'})
    except Exception as e:
        print("Error processing meeting ID:", e)
        return web.json_response({'status': 'error'}, status=400)

# Modified GET handler
async def get_meeting_id_handler(request):
    return web.json_response({'activeMeetings': list(ACTIVE_MEETINGS.keys())})

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