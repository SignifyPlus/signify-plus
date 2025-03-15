import asyncio
import json
from aiohttp import web
import os
from dotenv import load_dotenv

load_dotenv()
SERVER_HOST = os.environ.get('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.environ.get('SERVER_PORT', 8080))
CURRENT_MEETING_ID = None  # Global variable to store the meeting ID

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

# HTTP handler to retrieve the meeting ID (GET /meeting-id)
async def get_meeting_id_handler(request):
    if CURRENT_MEETING_ID:
        return web.json_response({'meetingId': CURRENT_MEETING_ID})
    else:
        return web.json_response({'error': 'No meeting ID available'}, status=404)

async def start_http_server():
    app = web.Application()
    app.router.add_post('/meeting-id', post_meeting_id_handler)
    app.router.add_get('/meeting-id', get_meeting_id_handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, SERVER_HOST, SERVER_PORT)
    await site.start()
    print(f"HTTP server running on {SERVER_HOST}:{SERVER_PORT}")
    # Keep the server running indefinitely
    while True:
        await asyncio.sleep(3600)

async def main():
    await start_http_server()

if __name__ == "__main__":
    asyncio.run(main())