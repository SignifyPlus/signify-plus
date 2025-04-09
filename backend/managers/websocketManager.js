const socketIo = require('socket.io');
const MeetingSocket = require('../webSockets/meetingSocket.js');
const MessageSocket = require('../webSockets/messageSocket.js');
const Socket = require('../webSockets/socket.js');

class WebSocketManager {
   constructor(server) {
      this.signifyPlusSocketIo = socketIo(server, {
         cors: { origin: '*' },
      });
      this.userSocketMap = {};
      this.setupSocketEvents(this.userSocketMap);
   }

   setupSocketEvents(userSocketMap) {
      this.signifyPlusSocketIo.on('connection', (socket) => {
         this.socket = new Socket(socket, userSocketMap);
         this.messageSocket = new MessageSocket(socket, userSocketMap);
         this.meetingSocket = new MeetingSocket(socket, userSocketMap);
      });
   }
}

module.exports = WebSocketManager;
