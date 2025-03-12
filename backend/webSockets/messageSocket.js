const ManagerFactory = require("../factories/managerFactory.js");
const RabbitMqConstants = require("../constants/rabbitMqConstants.js");
const ControllerFactory = require("../factories/controllerFactory.js");
const EventFactory = require("../factories/eventFactory.js");
const EventConstants = require("../constants/eventConstants.js");
class MessageSocket {
    #messageQueueName = null;
    #cachedChats = null;
    constructor(socket, userSocketMap) {
        //setup rabbitMq
        this.#messageQueueName = RabbitMqConstants.MESSAGES_QUEUE;
        this.establishConnectionWithRabbitMqQueue();
        //setup events (for observer/subject pattern)
        EventFactory.getEventDispatcher.registerListener(EventConstants.CHAT_CREATED_EVENT, this.chatCreatedListener.bind(this));
        //on db update (via an event), update the map/list
        this.#cachedChats = this.cacheChats();
        this.messageEvent(socket, userSocketMap);
    }

    async messageEvent(socket, userSocketMap) {
        socket.on('message', async (data) => {
            this.#cachedChats = await this.#cachedChats;
            var pingWasSuccesful = true;
            try {
                if (data.targetPhoneNumbers == null || data.targetPhoneNumbers.length == 0 ){
                    socket.emit('message-failure', {error: `targetPhoneNumber is not provided - receiver info: Number:${data.senderPhoneNumber} SocketId:${userSocketMap[data.senderPhoneNumber]}`});
                    return;
                }
                if (this.#messageQueueName == null) {
                    throw new Error(`Queue Name not initialized - terminating the event`);
                }
                ///use event driven approach
                data.targetPhoneNumbers.forEach(targetPhoneNumber => {
                    if (userSocketMap[targetPhoneNumber] == null) {
                        console.log(`targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`);
                        return;
                    }
                    console.log(`Original cached chat: ${this.#cachedChats}`);
                    console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${targetPhoneNumber}`);
                    //find the chat now
                    socket.to(userSocketMap[targetPhoneNumber]).emit('message', data.message);
                });

            }catch(exception) {
                console.log(`Exception Occured: ${exception}`);
                pingWasSuccesful = false;
            }

            if (pingWasSuccesful) {
                //instead of queueing the same message for each number, just send it once to the rabbitMq - because the above loop is just to make sure the message is forwarded to the desired phoneNumber
                //requires an array
                await ManagerFactory.getRabbitMqQueueManager().queueMessage(this.#messageQueueName, [data]);
            }
        })
    }

    async chatCreatedListener() {
        //cache upon creation - (better approach since we are not monitoring database constantly + neither querying in each message socket event)
        this.#cachedChats = await this.cacheChats();
    }

    async establishConnectionWithRabbitMqQueue() {
        await ManagerFactory.getRabbitMqQueueManager().establishConnection();
    }

    async cacheChats () {
        return await ControllerFactory.getChatController.getAllChats();
    }

} 

module.exports = MessageSocket;