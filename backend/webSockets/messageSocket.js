const ManagerFactory = require("../factories/managerFactory.js");
const RabbitMqConstants = require("../constants/rabbitMqConstants.js");
const ControllerFactory = require("../factories/controllerFactory.js");
const EventFactory = require("../factories/eventFactory.js");
const EventConstants = require("../constants/eventConstants.js");
const CommonUtils = require("../utilities/commonUtils.js");
class MessageSocket {
    #messageQueueName = null;
    #cachedChats = null;
    constructor(socket, userSocketMap) {
        //setup rabbitMq
        this.#messageQueueName = RabbitMqConstants.MESSAGES_QUEUE;
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

                //find the chat now
                const chatId = await ControllerFactory.getChatController().filterChat(this.#cachedChats, [...data.targetPhoneNumbers, data.senderPhoneNumber]);
                ///use event driven approach
                data.targetPhoneNumbers.forEach(async (targetPhoneNumber) => {
                    if (userSocketMap[targetPhoneNumber] == null) {
                        console.log(`targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`);
                        return;
                    }
                    console.log(`Incoming Message ${data.message} for the targetPhoneNumber ${targetPhoneNumber} chatId: ${chatId}`);

                    socket.to(userSocketMap[targetPhoneNumber]).emit('message', {message: data.message, chatId: chatId});
                });

            }catch(exception) {
                console.log(`Exception Occured: ${exception}`);
                pingWasSuccesful = false;
            }

            if (pingWasSuccesful) {
                //aww this worked!! - blocks the execution
                await CommonUtils.waitForVariableToBecomeNonNull(ManagerFactory.getRabbitMqQueueManager);
                //send stringified data - otherwise causes issue
                await ManagerFactory.getRabbitMqQueueManager().queueMessage(this.#messageQueueName, RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE, RabbitMqConstants.BUFFER_ENCODING, JSON.stringify(data));
            }
        })
    }

    async chatCreatedListener() {
        //cache upon creation - (better approach since we are not monitoring database constantly + neither querying in each message socket event)
        this.#cachedChats = await this.cacheChats();
        console.log(`Chat Renewed: ${this.#cachedChats}`);
    }

    async cacheChats () {
        return await ControllerFactory.getChatController().getAllChats();
    }
} 

module.exports = MessageSocket;