const LoggerFactory = require('../factories/loggerFactory.js');
class Socket {
   constructor(socket, userSocketMap, callSocketMap) {
      this.socketRegistrationEvent(socket, userSocketMap);
   }

   socketRegistrationEvent(socket, userSocketMap) {
      socket.on('socket-registration', (data) => {
         //add userID and the socket id to the map
         userSocketMap.set(data.userPhoneNumber, socket.id);
         LoggerFactory.getApplicationLogger.info(
            `User ${data.userPhoneNumber} registered with socket ID: ${socket.id}`,
         );
      });
   }
}

module.exports = Socket;
