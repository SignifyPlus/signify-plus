class Socket {
    constructor(socket, userSocketMap) { 
        this.socketRegistrationEvent(socket, userSocketMap);
        this.socketDisconnectionEvent(socket, userSocketMap);
    }
    
    socketRegistrationEvent(socket, userSocketMap) {
        socket.on('socket-registration', (data) => {
            //add userID and the socket id to the map
            userSocketMap[data.userPhoneNumber] = socket.id;
            console.log(`User ${data.userPhoneNumber} registered with socket ID: ${socket.id}`);
        })
    }

    socketDisconnectionEvent(socket, userSocketMap) {
        socket.on('socket-disconnect', () => {
            console.log(`Socket with id ${socket.id.substr(0,2)} disconnected`);
        });
    }
}

module.exports = Socket;