class MessageSocket {
    constructor(socket) {
        this.messageEvent(socket);
    }

    messageEvent(socket) {
        socket.on('message', (data) => {
            console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${data.targetPhoneNumber}`);

            if (data.targetPhoneNumber == null){
                socket.emit('message-failure', {error: `targetSocketId is not provided - receiver info: ${data.receiverPhoneNumber}`});
                return;
            }
            socket.to(data.targetPhoneNumber).emit('message', data.message);
        })
    }
} 

module.exports = MessageSocket;