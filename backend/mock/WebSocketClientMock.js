const io = require('socket.io-client');
require("dotenv").config();
const mockSocket = io(process.env.RENDER_URL);

mockSocket.on('connect', () => {
    console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);

    mockSocket.emit('message', 'Hello from mock Client!');

    //we should not be broadcasting this to everyone
    //so we'll use senderId,
    //targets, the sender which wants to make a call to
    // and the meeting id
    mockSocket.emit('socket-registration', {
        userId : '789067567'
    });

    mockSocket.emit('meeting-id', {
        callerUserId: '789067567',
        meetingId: '412532646',
        targetUserIds: ['789067567', '241516663']
    });
})

mockSocket.on('message', (message) => {
    console.log(`Message Received From Server ${message}`);
});

mockSocket.on('disconnect', () => {
    console.log('Disconnected from server');
});

mockSocket.on('meeting-id-offer', (data) => {
    console.log(`Meeting ID Offer received from server ${data.sender}`);
    console.log(`Meeting ID: ${data.meetingId}`);
})

mockSocket.on('meeting-id-failed', (data) => {
    console.log(`Meeting ID Offer received from server ${data.sender}`);
    console.log(`Meeting ID: ${data.message}`);
})