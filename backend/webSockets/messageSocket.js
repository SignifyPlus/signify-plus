class MessageSocket {
    constructor(socket, userSocketMap) {
        this.messageEvent(socket, userSocketMap);
    }

    messageEvent(socket, userSocketMap) {
        socket.on('message', (data) => {
            if (data.targetPhoneNumber == null){
                socket.emit('message-failure', {error: `targetPhoneNumber is not provided - receiver info: Number:${data.senderPhoneNumber} SocketId:${userSocketMap[data.senderPhoneNumber]}`});
                return;
            }

            console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${data.targetPhoneNumber}`);
            socket.to(userSocketMap[data.targetPhoneNumber]).emit('message', data.message);
        })
    }
} 

module.exports = MessageSocket;