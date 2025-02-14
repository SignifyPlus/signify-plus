const socketIo = require('socket.io');
const MeetingSocket = require("../webSockets/meetingSocket.js");
const MessageSocket = require("../webSockets/messageSocket.js");
const Socket = require("../webSockets/socket.js");

class WebSocketManager {
    constructor(server) {
        this.signifyPlusSocketIo = socketIo(server, {
            cors: {origin: "*"}
        });
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.signifyPlusSocketIo.on('connection', (socket) => {
            console.log('Connected');
            this.socket = new Socket(socket);
            this.messageSocket = new MessageSocket(socket);
            this.meetingSocket = new MeetingSocket(socket);
        })
    }
}

module.exports = WebSocketManager;


