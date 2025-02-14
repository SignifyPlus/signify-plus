class MessageSocket {
    constructor(socket) {
        this.messageEvent(socket);
    }

    messageEvent(socket) {
        socket.on('message', (data) => {
            console.log(`Incoming Message ${data.message} for the targetSocketId ${data.targetSocketId}`);

            if (data.receiverSocketId == null){
                socket.emit('message-failure', {error: `targetSocketId is not provided - receiver info: ${data.receiverSocketId}`});
                return;
            }
            socket.to(data.targetSocketId).emit('message', data.message);
        })
    }
} 