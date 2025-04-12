const RabbitMqConstants = require('../constants/rabbitMqConstants.js');
const EventConstants = require('../constants/eventConstants.js');
const MessageSocketUtils = require('./utils/messageSocketUtils.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const CommonConstants = require('../constants/commonConstants.js');
const WebSocketMessageDto = require('../dtos/WebSocketMessageDto.js');
class MessageSocket {
   #messageQueueName = null;
   #databaseCachedChats = null;
   constructor(socket, userSocketMap) {
      //setup rabbitMq
      this.#messageQueueName = RabbitMqConstants.MESSAGES_QUEUE;
      //setup events (for observer/subject pattern)
      EventDispatcher.registerListener(
         EventConstants.CHAT_CREATED_EVENT,
         this.chatCreatedListener.bind(this),
      );
      //on db update (via an event), update the map/list
      this.#databaseCachedChats = MessageSocketUtils.cacheChats();
      this.messageEvent(socket, userSocketMap);
   }

   async messageEvent(socket, userSocketMap) {
      socket.on('message', async (data) => {
         this.#databaseCachedChats = await this.#databaseCachedChats;
         var pingWasSuccesful = true;
         const messageDto = new WebSocketMessageDto(
            data?.chatId,
            data?.senderPhoneNumber,
            data?.targetPhoneNumbers,
            data?.message,
         );
         try {
            if (
               messageDto.targetPhoneNumbers == null ||
               messageDto.targetPhoneNumbers.length == 0
            ) {
               socket.emit('message-failure', {
                  error: `targetPhoneNumber is not provided - receiver info: Number:${messageDto.senderPhoneNumber} SocketId:${userSocketMap[messageDto.senderPhoneNumber]}`,
               });
               return;
            }
            if (this.#messageQueueName == null) {
               throw new Error(
                  `Queue Name not initialized - terminating the event`,
               );
            }

            //find the chat now
            messageDto.chatId =
               (messageDto.chatId == null
                  ? await MessageSocketUtils.filterChat(
                       this.#databaseCachedChats,
                       messageDto.targetPhoneNumbers,
                       messageDto.senderPhoneNumber,
                    )
                  : messageDto.chatId) == null
                  ? await this.createNewChat(
                       messageDto.senderPhoneNumber,
                       messageDto.targetPhoneNumbers,
                    )
                  : messageDto.chatId;
            ///use event driven approach
            messageDto.targetPhoneNumbers.forEach(async (targetPhoneNumber) => {
               if (userSocketMap[targetPhoneNumber] == null) {
                  LoggerFactory.getApplicationLogger.info(
                     `targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`,
                  );
                  return;
               }
               socket
                  .to(userSocketMap[targetPhoneNumber])
                  .emit('message', {
                     message: messageDto.message,
                     chatId: messageDto.chatId,
                  });
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
            LoggerFactory.getApplicationLogger.info(
               `MessageDTO: ${JSON.stringify(messageDto)}`,
            );
            //for now replace with this
            EventDispatcher.dispatchEvent(
               EventConstants.MESSAGE_INGEST_EVENT,
               messageDto,
            );
         }
      });
   }

   async chatCreatedListener() {
      //cache upon creation - (better approach since we are not monitoring database constantly + neither querying in each message socket event)
      this.#databaseCachedChats = await MessageSocketUtils.cacheChats();
   }

   async createNewChat(senderPhoneNumber, targetPhoneNumbers) {
      const chatData = await MessageSocketUtils.createNewChat(
         senderPhoneNumber,
         targetPhoneNumbers,
      );
      if (chatData.exception) {
         LoggerFactory.getApplicationLogger.error(
            `Exception Occured when creating a new Chat: ${chatData.exception}`,
         );
      }
      return chatData.data[CommonConstants.FIRST_ENTRY]._id.toString();
   }
}

module.exports = MessageSocket;
