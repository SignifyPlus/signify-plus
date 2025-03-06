const ManagerFactory = require("../factories/managerFactory.js");
class MessageSocket {
    #messageQueueName = null;
    constructor(socket, userSocketMap) {
        this.messageEvent(socket, userSocketMap);
        this.messageQueueName = 'chat-messages';
        //establish connection to rabbitMq
        this.establishConnectionWithRabbitMqQueue();
    }

    async establishConnectionWithRabbitMqQueue() {
        await ManagerFactory.getRabbitMqQueueManager().establishConnection();
    }

    async messageEvent(socket, userSocketMap) {
        socket.on('message', async (data) => {
            var pingWasSuccesful = true;
            try {
                if (data.targetPhoneNumbers == null || data.targetPhoneNumbers.length == 0 ){
                    socket.emit('message-failure', {error: `targetPhoneNumber is not provided - receiver info: Number:${data.senderPhoneNumber} SocketId:${userSocketMap[data.senderPhoneNumber]}`});
                    return;
                }
                if (this.#messageQueueName == null) {
                    throw new Error(`Queue Name not initialized - terminating the event`);
                }
                data.targetPhoneNumbers.forEach(targetPhoneNumber => {
                    if (userSocketMap[targetPhoneNumber] == null) {
                        console.log(`targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`);
                        return;
                    }
                    console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${targetPhoneNumber}`);
                    socket.to(userSocketMap[targetPhoneNumber]).emit('message', data.message);
                });

            }catch(exception) {
                console.log(`Exception Occured: ${exception}`);
                pingWasSuccesful = false;
            }

            if (pingWasSuccesful) {
                //instead of queueing the same message for each number, just send it once to the rabbitMq - because the above loop is just to make sure the message is forwarded to the desired phoneNumber
                await ManagerFactory.getRabbitMqQueueManager().queueMessage(this.#messageQueueName, data);
            }
        })
    }
} 

module.exports = MessageSocket;