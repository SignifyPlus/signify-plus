class MessageSocket {
    constructor(socket) {
        this.messageEvent(socket);
    }

    messageEvent(socket) {
        socket.on('message', (data) => {
            console.log(`Incoming Message ${data.message} for the targetSocketId ${data.receiverSocketId}`);

            if (data.receiverSocketId == null){
                socket.emit('message-failure', {error: `TargetUser is provided ${data.receiverSocketId}`});
                return;
            }
            socket.to(data.targetSocketId).emit('message', data.message);
        })
    }
} 