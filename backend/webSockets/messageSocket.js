class MessageSocket {
    constructor(socket, userSocketMap) {
        this.messageEvent(socket, userSocketMap);
    }

    async messageEvent(socket, userSocketMap) {
        socket.on('message', (data) => {
            if (data.targetPhoneNumbers == null || data.targetPhoneNumbers.length == 0 ){
                socket.emit('message-failure', {error: `targetPhoneNumber is not provided - receiver info: Number:${data.senderPhoneNumber} SocketId:${userSocketMap[data.senderPhoneNumber]}`});
                return;
            }

            data.targetPhoneNumbers.forEach(targetPhoneNumber => {
                console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${targetPhoneNumber}`);
                socket.to(userSocketMap[targetPhoneNumber]).emit('message', data.message);
            });
        })
    }
} 

module.exports = MessageSocket;