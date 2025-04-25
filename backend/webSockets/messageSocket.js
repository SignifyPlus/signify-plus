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
            data?.replyToId // Add support for replies
         );
         try {
            if (
               messageDto.targetPhoneNumbers == null ||
               messageDto.targetPhoneNumbers.length == 0
            ) {
               socket.emit('message-failure', {
                  error: `targetPhoneNumbers is not provided - receiver info: Number:${messageDto.senderPhoneNumber} SocketId:${userSocketMap[messageDto.senderPhoneNumber]}`,
               });
               return;
            }
            if (this.#messageQueueName == null) {
               throw new Error(
                  `Queue Name not initialized - terminating the event`,
               );
            }

            //TODO -- an edge case - where both the sender and receiver register at the same time - chat id for both the cases will be null
            //think about how to deal with it. Maybe a temp chat id, and use that in mongodb later? not sure if possible, but mull/think over it
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
               socket.to(userSocketMap[targetPhoneNumber]).emit('message', {
                  message: messageDto.message,
                  chatId: messageDto.chatId,
                  replyToId: messageDto.replyToId, // Add reply info to emit event
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
       // Add listeners for other message actions
       this.setupMessageActionsListeners(socket, userSocketMap);
      }
      // Add new listener methods for other message actions
      setupMessageActionsListeners(socket, userSocketMap) {
         // Handle message editing
         socket.on('edit-message', async (data) => {
            try {
               if (!data.messageId || !data.newContent || !data.senderPhoneNumber) {
                  socket.emit('message-action-failure', {
                     error: 'Missing required fields for message edit',
                     action: 'edit-message'
                  });
                  return;
               }
               // Get the message and validate sender
               const result = await MessageSocketUtils.validateMessageOwnership(
                  data.messageId, 
                  data.senderPhoneNumber
               );
               if (!result.success) {
                  socket.emit('message-action-failure', {
                     error: result.error,
                     action: 'edit-message'
                  });
                  return;
               }
               // Update the message
               const updatedMessage = await MessageSocketUtils.editMessage(
                  data.messageId,
                  data.newContent
               );
               // Notify all users in the chat
               if (updatedMessage) {
                  const targetPhoneNumbers = await MessageSocketUtils.getMessageRecipients(data.messageId);
                  targetPhoneNumbers.forEach(phoneNumber => {
                     if (userSocketMap[phoneNumber]) {
                        socket.to(userSocketMap[phoneNumber]).emit('message-edited', {
                           messageId: data.messageId,
                           newContent: data.newContent,
                           chatId: updatedMessage.chatId
                        });
                     }
                  });
                  // Confirm to sender
                  socket.emit('message-edited', {
                     messageId: data.messageId,
                     newContent: data.newContent,
                     chatId: updatedMessage.chatId
                  });
               }
            } catch (error) {
               LoggerFactory.getApplicationLogger.error(`Exception in edit-message: ${error}`);
               socket.emit('message-action-failure', {
                  error: 'Failed to edit message',
                  action: 'edit-message'
               });
            }
         });
         // Handle message deletion
         socket.on('delete-message', async (data) => {
            try {
               if (!data.messageId || !data.senderPhoneNumber) {
                  socket.emit('message-action-failure', {
                     error: 'Missing required fields for message delete',
                     action: 'delete-message'
                  });
                  return;
               }
               // Get the message and validate sender
               const result = await MessageSocketUtils.validateMessageOwnership(
                  data.messageId, 
                  data.senderPhoneNumber
               );
               if (!result.success) {
                  socket.emit('message-action-failure', {
                     error: result.error,
                     action: 'delete-message'
                  });
                  return;
               }
               // Delete the message
               const deletedMessage = await MessageSocketUtils.softDeleteMessage(data.messageId);
               // Notify all users in the chat
               if (deletedMessage) {
                  const targetPhoneNumbers = await MessageSocketUtils.getMessageRecipients(data.messageId);
                  targetPhoneNumbers.forEach(phoneNumber => {
                     if (userSocketMap[phoneNumber]) {
                        socket.to(userSocketMap[phoneNumber]).emit('message-deleted', {
                           messageId: data.messageId,
                           chatId: deletedMessage.chatId
                        });
                     }
                  });
                  // Confirm to sender
                  socket.emit('message-deleted', {
                     messageId: data.messageId,
                     chatId: deletedMessage.chatId
                  });
               }
            } catch (error) {
               LoggerFactory.getApplicationLogger.error(`Exception in delete-message: ${error}`);
               socket.emit('message-action-failure', {
                  error: 'Failed to delete message',
                  action: 'delete-message'

               });
            }
         });
         // Handle message pin/unpin
         socket.on('pin-message', async (data) => {
            try {
               if (!data.messageId || !data.userPhoneNumber || data.isPinned === undefined) {
                  socket.emit('message-action-failure', {
                     error: 'Missing required fields for pin message',
                     action: 'pin-message'
                  });
                  return;
               }
               // Pin/unpin the message
               const result = await MessageSocketUtils.pinMessage(
                  data.messageId,
                  data.userPhoneNumber,
                  data.isPinned
               );
               if (!result.success) {
                  socket.emit('message-action-failure', {
                     error: result.error,
                     action: 'pin-message'
                  });
                  return;
               }
               // Notify all users in the chat
               const targetPhoneNumbers = await MessageSocketUtils.getChatParticipants(result.data.chatId);
               targetPhoneNumbers.forEach(phoneNumber => {
                  if (userSocketMap[phoneNumber]) {
                     socket.to(userSocketMap[phoneNumber]).emit('message-pin-updated', {
                        messageId: data.messageId,
                        isPinned: data.isPinned,
                        chatId: result.data.chatId
                     });
                  }
               });
               // Confirm to sender
               socket.emit('message-pin-updated', {
                  messageId: data.messageId,
                  isPinned: data.isPinned,
                  chatId: result.data.chatId
               });
            } catch (error) {
               LoggerFactory.getApplicationLogger.error(`Exception in pin-message: ${error}`);
               socket.emit('message-action-failure', {
                  error: 'Failed to update pin status',
                  action: 'pin-message'
               });
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
