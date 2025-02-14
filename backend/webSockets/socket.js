class Socket {
    constructor(socket) { 
        console.log(`Initializing socket`);
        this.socketRegistrationEvent(socket);
        this.socketDisconnectionEvent(socket);
    }
    
    socketRegistrationEvent(socket) {
        socket.on('socket-registration', (data) => {
            //add userID and the socket id to the map
            this.userSocketMap[data.userPhoneNumber] = socket.id;
            console.log(`User ${data.userPhoneNumber} registered with socket ID: ${socket.id}`);
        })
    }

    socketDisconnectionEvent(socket) {
        socket.on('socket-disconnect', () => {
            console.log(`Socket with id ${socket.id.substr(0,2)} disconnected`);
        });
    }
}