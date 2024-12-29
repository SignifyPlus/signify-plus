const io = require('socket.io-client');
require("dotenv").config();
const mockSocket = io(process.env.RENDER_URL);

mockSocket.on('connect', () => {
    console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);

    mockSocket.emit('message', 'Hello from mock Client!');

    mockSocket.emit('meeting-id', {
        target: 'targetSocketId',
        meetingId: 12345,
        targets: ['targetSocketId']
    });
})

mockSocket.on('message', (message) => {
    console.log(`Message Received From Server ${message}`);
});

mockSocket.on('disconnect', () => {
    console.log('Disconnected from server');
});

