const RabbitMqConstants = require('../constants/rabbitMqConstants.js');
const EventConstants = require('../constants/eventConstants.js');
const MessageSocketUtils = require('./utils/messageSocketUtils.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const LoggerFactory = require('../factories/loggerFactory.js');
class MessageSocket {
   #messageQueueName = null;
   #cachedChats = null;
   constructor(socket, userSocketMap) {
      //setup rabbitMq
      this.#messageQueueName = RabbitMqConstants.MESSAGES_QUEUE;
      //setup events (for observer/subject pattern)
      EventDispatcher.registerListener(
         EventConstants.CHAT_CREATED_EVENT,
         this.chatCreatedListener.bind(this),
      );
      //on db update (via an event), update the map/list
      this.#cachedChats = MessageSocketUtils.cacheChats();
      this.messageEvent(socket, userSocketMap);
   }

   async messageEvent(socket, userSocketMap) {
      socket.on('message', async (data) => {
         this.#cachedChats = await this.#cachedChats;
         var pingWasSuccesful = true;
         var chatId = null;
         try {
            if (
               data.targetPhoneNumbers == null ||
               data.targetPhoneNumbers.length == 0
            ) {
               socket.emit('message-failure', {
                  error: `targetPhoneNumber is not provided - receiver info: Number:${data.senderPhoneNumber} SocketId:${userSocketMap[data.senderPhoneNumber]}`,
               });
               return;
            }
            if (this.#messageQueueName == null) {
               throw new Error(
                  `Queue Name not initialized - terminating the event`,
               );
            }

            //find the chat now
            chatId = await MessageSocketUtils.filterChat(
               this.#cachedChats,
               data.targetPhoneNumbers,
               data.senderPhoneNumber,
            );
            ///use event driven approach
            data.targetPhoneNumbers.forEach(async (targetPhoneNumber) => {
               if (userSocketMap[targetPhoneNumber] == null) {
                  LoggerFactory.getApplicationLogger.info(
                     `targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`,
                  );
                  return;
               }
               LoggerFactory.getApplicationLogger.info(
                  `Incoming Message ${data.message} for the targetPhoneNumber ${targetPhoneNumber} chatId: ${chatId}`,
               );

               socket
                  .to(userSocketMap[targetPhoneNumber])
                  .emit('message', { message: data.message, chatId: chatId });
            });
         } catch (exception) {
            LoggerFactory.getApplicationLogger.error(
               `Exception Occured: ${exception}`,
            );
            pingWasSuccesful = false;
         }

         if (pingWasSuccesful) {
            //aww this worked!! - blocks the execution
            //comment this out for now and directly ping - via an event - the message controller to add the record directly to the database (to test the delays with rabbitMQ)

            //await CommonUtils.waitForVariableToBecomeNonNull(
            //ManagerFactory.getRabbitMqQueueManager,
            //);

            //send stringified data - otherwise causes issue

            //await ManagerFactory.getRabbitMqQueueManager().queueMessage(
            //this.#messageQueueName,
            //RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE,
            //CommonConstants.BUFFER_ENCODING,
            //JSON.stringify(
            //await MessageSocketUtils.prepareChatQueueData(data, chatId),
            ///),
            //);

            const preparedData = await MessageSocketUtils.prepareChatQueueData(
               data,
               chatId,
            );
            LoggerFactory.getApplicationLogger.info(`${preparedData}`);
            //for now replace with this
            EventDispatcher.dispatchEvent(
               EventConstants.MESSAGE_INGEST_EVENT,
               preparedData,
            );
         }
      });
   }

   async chatCreatedListener() {
      //cache upon creation - (better approach since we are not monitoring database constantly + neither querying in each message socket event)
      this.#cachedChats = await MessageSocketUtils.cacheChats();
   }
}

module.exports = MessageSocket;
