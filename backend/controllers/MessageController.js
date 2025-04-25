const ServiceFactory = require('../factories/serviceFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const TimeUtils = require('../utilities/timeUtils.js');
const CommonUtils = require('../utilities/commonUtils.js');
const ControllerConstants = require('../constants/controllerConstants.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const mongoose = require('mongoose');

class MessageController {
   constructor() {}

   //creates a message entry in the database, with To and From + content and chat id - if a chat doesn't exist before sending a message, initialize an empty chat
   //refactor postMessage so it can be used by the event listeners as well
   postMessage = async (request, response) => {
      try {
         //request validations
         const mainUserPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.mainUserPhoneNumber,
            400,
            `mainUserPhoneNumber is required!`,
            response,
         );
         if (mainUserPhoneNumberValidation)
            return mainUserPhoneNumberValidation;

         const targetUserPhoneNumbersValidation =
            await ExceptionHelper.validate(
               request.body.targetUserPhoneNumbers,
               400,
               `targetUserPhoneNumbers is required! - it's an array [+902313124, +9014214125]`,
               response,
            );
         if (targetUserPhoneNumbersValidation)
            return targetUserPhoneNumbersValidation;

         const messageValidation = await ExceptionHelper.validate(
            request.body.message,
            400,
            `message Content is required!`,
            response,
         );
         if (messageValidation) return messageValidation;

         //database validations
         const mainUserPhoneNumberUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.mainUserPhoneNumber,
            });
         const mainUserObjectValidation = await ExceptionHelper.validate(
            mainUserPhoneNumberUserObject,
            400,
            `mainUserPhoneNumber doesnt Exist in the user table!`,
            response,
         );
         if (mainUserObjectValidation) return mainUserObjectValidation;

         const targetUserPhoneNumberUserObjects =
            await ServiceFactory.getUserService.getDocumentsByCustomFilters({
               phoneNumber: { $in: request.body.targetUserPhoneNumbers },
            });

         if (
            targetUserPhoneNumberUserObjects.length !=
            request.body.targetUserPhoneNumbers.length
         ) {
            const signifyException = new SignifyException(
               400,
               `Not all phoneNumbers are registered to the User table!`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }

         const mappedTargetUserPhoneNumbersToId =
            targetUserPhoneNumberUserObjects.map((user) => user._id.toString());
         const mappedMainUserId = mainUserPhoneNumberUserObject._id.toString();

         var chat =
            await ServiceFactory.getChatService.getDocumentByCustomFilters({
               mainUserId: mappedMainUserId,
               participants: {
                  $all: mappedTargetUserPhoneNumbersToId,
                  $size: targetUserPhoneNumberUserObjects.length,
               },
            });

         if (!chat) {
            LoggerFactory.getApplicationLogger.info(
               'Chat Doesnt Exist - initializing a new chat',
            );
            chat = await ServiceFactory.getChatService.saveDocument({
               mainUserId: mappedMainUserId,
               participants: mappedTargetUserPhoneNumbersToId,
            });
         }
         
         // Create message object
         const messageData = {
            senderId: mappedMainUserId,
            receiverIds: mappedTargetUserPhoneNumbersToId,
            chatId: chat[ControllerConstants.ZERO_INDEX]._id.toString(),
            content: request.body.message,
         };
         
         // Add reply reference if this is a reply
         if (request.body.replyToId) {
            const replyToMessage = await ServiceFactory.getMessageService.getDocumentById(
               request.body.replyToId
            );
            
            if (!replyToMessage) {
               return response.status(400).json({ 
                  error: "The message you're replying to doesn't exist" 
               });
            }
            
            messageData.replyToId = request.body.replyToId;
         }
         
         const message = await ServiceFactory.getMessageService.saveDocument(messageData);
         return response.json(message);
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   //feature for deleting a message (within a timespan of 1 minute)
   deleteMessage = async (request, response) => {
      try {
         //request validations
         const senderPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.senderPhoneNumber,
            400,
            `senderPhoneNumber is required!`,
            response,
         );
         if (senderPhoneNumberValidation) return senderPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response,
         );
         if (messageIdValidation) return messageIdValidation;

         //database validations
         const senderPhoneNumberUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.senderPhoneNumber,
            });
         const senderUserObjectValidation = await ExceptionHelper.validate(
            senderPhoneNumberUserObject,
            400,
            `senderPhoneNumber doesnt Exist in the user table!`,
            response,
         );
         if (senderUserObjectValidation) return senderUserObjectValidation;

         //why are we querying on phoneNumber and messageID - we dont want another use to tap on the message and try to delete that since that message isn't own by them
         //only the one who sent it can delete it within 5 minutes timespan
         const messageToDelete =
            await ServiceFactory.getMessageService.getDocumentByCustomFilters({
               _id: request.body.messageId,
               senderId: senderPhoneNumberUserObject._id.toString(),
            });
         const messageToDeleteValidation = await ExceptionHelper.validate(
            messageToDelete,
            400,
            `Message Doesn't Belong to the user!!`,
            response,
         );
         if (messageToDeleteValidation) return messageToDeleteValidation;

         const createdDateTimeInSeconds = TimeUtils.getTimeInSeconds(
            messageToDelete.createdAt.getTime(),
         );
         const canMessageBeDeleted =
            TimeUtils.isTimeDifferenceLessThanElapsedLimit(
               ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION,
               createdDateTimeInSeconds,
            );
         const finalResponse = canMessageBeDeleted
            ? { message: `Message Deleted: ${messageToDelete}` }
            : { message: "Message Can't be deleted - it's too old" };
         finalResponse
            ? await ServiceFactory.getMessageService.deleteDocument({
                 _id: messageToDelete._id.toString(),
              })
            : null;
         return response.json(finalResponse);
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // New method for soft deleting a message (no time limit)
   softDeleteMessage = async (request, response) => {
      try {
         //request validations
         const senderPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.senderPhoneNumber,
            400,
            `senderPhoneNumber is required!`,
            response,
         );
         if (senderPhoneNumberValidation) return senderPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response,
         );
         if (messageIdValidation) return messageIdValidation;

         //database validations
         const senderPhoneNumberUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.senderPhoneNumber,
            });
         const senderUserObjectValidation = await ExceptionHelper.validate(
            senderPhoneNumberUserObject,
            400,
            `senderPhoneNumber doesnt Exist in the user table!`,
            response,
         );
         if (senderUserObjectValidation) return senderUserObjectValidation;

         const messageToDelete =
            await ServiceFactory.getMessageService.getDocumentByCustomFilters({
               _id: request.body.messageId,
               senderId: senderPhoneNumberUserObject._id.toString(),
            });
         const messageToDeleteValidation = await ExceptionHelper.validate(
            messageToDelete,
            400,
            `Message Doesn't Belong to the user!!`,
            response,
         );
         if (messageToDeleteValidation) return messageToDeleteValidation;

         await ServiceFactory.getMessageService.softDeleteMessage(messageToDelete._id.toString());
         return response.json({ message: "Message soft deleted successfully" });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Edit a message
   editMessage = async (request, response) => {
      try {
         //request validations
         const senderPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.senderPhoneNumber,
            400,
            `senderPhoneNumber is required!`,
            response,
         );
         if (senderPhoneNumberValidation) return senderPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response,
         );
         if (messageIdValidation) return messageIdValidation;

         const newContentValidation = await ExceptionHelper.validate(
            request.body.newContent,
            400,
            `newContent is required!`,
            response,
         );
         if (newContentValidation) return newContentValidation;

         //database validations
         const senderPhoneNumberUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.senderPhoneNumber,
            });
         const senderUserObjectValidation = await ExceptionHelper.validate(
            senderPhoneNumberUserObject,
            400,
            `senderPhoneNumber doesnt Exist in the user table!`,
            response,
         );
         if (senderUserObjectValidation) return senderUserObjectValidation;

         const messageToEdit =
            await ServiceFactory.getMessageService.getDocumentByCustomFilters({
               _id: request.body.messageId,
               senderId: senderPhoneNumberUserObject._id.toString(),
            });
         const messageToEditValidation = await ExceptionHelper.validate(
            messageToEdit,
            400,
            `Message Doesn't Belong to the user!!`,
            response,
         );
         if (messageToEditValidation) return messageToEditValidation;

         // Check time limit for editing (5 minutes)
         const createdDateTimeInSeconds = TimeUtils.getTimeInSeconds(
            messageToEdit.createdAt.getTime()
         );
         const canMessageBeEdited =
            TimeUtils.isTimeDifferenceLessThanElapsedLimit(
               ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION, // Reusing the same constant
               createdDateTimeInSeconds
            );

         if (!canMessageBeEdited) {
            return response.status(400).json({
               message: "Message Can't be edited - it's too old"
            });
         }

         const updatedMessage = await ServiceFactory.getMessageService.editMessage(
            messageToEdit._id.toString(),
            request.body.newContent
         );
         
         return response.json({
            message: "Message updated successfully",
            updatedMessage
         });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Forward a message
   forwardMessage = async (request, response) => {
      try {
         // Validate input
         const senderPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.senderPhoneNumber,
            400,
            `senderPhoneNumber is required!`,
            response
         );
         if (senderPhoneNumberValidation) return senderPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response
         );
         if (messageIdValidation) return messageIdValidation;

         const targetUserPhoneNumbersValidation = await ExceptionHelper.validate(
            request.body.targetUserPhoneNumbers,
            400,
            `targetUserPhoneNumbers is required! - it's an array [+902313124, +9014214125]`,
            response
         );
         if (targetUserPhoneNumbersValidation) return targetUserPhoneNumbersValidation;

         // Get user details
         const senderUser = await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: request.body.senderPhoneNumber,
         });
         const senderUserValidation = await ExceptionHelper.validate(
            senderUser,
            400,
            `senderPhoneNumber doesn't exist in the user table!`,
            response
         );
         if (senderUserValidation) return senderUserValidation;

         // Get message to forward
         const messageToForward = await ServiceFactory.getMessageService.getDocumentById(
            request.body.messageId
         );
         const messageToForwardValidation = await ExceptionHelper.validate(
            messageToForward,
            400,
            `Message doesn't exist!`,
            response
         );
         if (messageToForwardValidation) return messageToForwardValidation;

         // Get target users
         const targetUsers = await ServiceFactory.getUserService.getDocumentsByCustomFilters({
            phoneNumber: { $in: request.body.targetUserPhoneNumbers }
         });

         if (targetUsers.length != request.body.targetUserPhoneNumbers.length) {
            return response.status(400).json({
               error: "Not all target phone numbers are registered in the user table!"
            });
         }

         const targetUserIds = targetUsers.map(user => user._id.toString());
         const senderId = senderUser._id.toString();

         // Find or create chat with target users
         const chat = await ServiceFactory.getChatService.getDocumentByCustomFilters({
            mainUserId: senderId,
            participants: {
               $all: targetUserIds,
               $size: targetUserIds.length
            }
         });

         let chatId;
         if (!chat) {
            // Create new chat
            const newChat = await ServiceFactory.getChatService.saveDocument({
               mainUserId: senderId,
               participants: targetUserIds
            });
            chatId = newChat[0]._id.toString();
         } else {
            chatId = chat[0]._id.toString();
         }

         // Forward the message
         const forwardedMessage = await ServiceFactory.getMessageService.saveDocument({
            senderId: senderId,
            receiverIds: targetUserIds,
            chatId: chatId,
            content: messageToForward.content,
            mediaId: messageToForward.mediaId
         });

         return response.json({
            message: "Message forwarded successfully",
            forwardedMessage
         });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Pin a message
   pinMessage = async (request, response) => {
      try {
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response
         );
         if (messageIdValidation) return messageIdValidation;

         const isPinnedValidation = await ExceptionHelper.validate(
            request.body.isPinned !== undefined,
            400,
            `isPinned (boolean) is required!`,
            response
         );
         if (isPinnedValidation) return isPinnedValidation;

         // Get user
         const user = await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: request.body.userPhoneNumber
         });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response
         );
         if (userValidation) return userValidation;

         // Get message
         const message = await ServiceFactory.getMessageService.getDocumentById(
            request.body.messageId
         );
         const messageValidation = await ExceptionHelper.validate(
            message,
            400,
            `Message doesn't exist!`,
            response
         );
         if (messageValidation) return messageValidation;

         // Check if user is part of this chat
         const chat = await ServiceFactory.getChatService.getDocumentById(message.chatId);
         const isUserPartOfChat = 
            chat.mainUserId.toString() === user._id.toString() || 
            chat.participants.some(p => p.toString() === user._id.toString());
         
         if (!isUserPartOfChat) {
            return response.status(403).json({
               error: "User is not part of this chat"
            });
         }

         // Update pin status
         await ServiceFactory.getMessageService.pinMessage(
            message._id.toString(),
            request.body.isPinned
         );

         return response.json({
            message: request.body.isPinned ? 
               "Message pinned successfully" : 
               "Message unpinned successfully"
         });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Toggle read/unread status
   toggleMessageReadStatus = async (request, response) => {
      try {
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;

         const messageIdValidation = await ExceptionHelper.validate(
            request.body.messageId,
            400,
            `messageId is not provided!`,
            response
         );
         if (messageIdValidation) return messageIdValidation;

         const isReadValidation = await ExceptionHelper.validate(
            request.body.isRead !== undefined,
            400,
            `isRead (boolean) is required!`,
            response
         );
         if (isReadValidation) return isReadValidation;

         // Get user
         const user = await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: request.body.userPhoneNumber
         });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response
         );
         if (userValidation) return userValidation;

         // Get message
         const message = await ServiceFactory.getMessageService.getDocumentById(
            request.body.messageId
         );
         const messageValidation = await ExceptionHelper.validate(
            message,
            400,
            `Message doesn't exist!`,
            response
         );
         if (messageValidation) return messageValidation;

         // Check if user is a receiver of this message
         const isUserReceiver = message.receiverIds.some(
            id => id.toString() === user._id.toString()
         );
         
         if (!isUserReceiver) {
            return response.status(403).json({
               error: "User is not a receiver of this message"
            });
         }

         // Update read status
         const updatedMessage = await ServiceFactory.getMessageService.updateDocument(
            { _id: message._id.toString() },
            { isRead: request.body.isRead }
         );

         return response.json({
            message: request.body.isRead ? 
               "Message marked as read" : 
               "Message marked as unread",
            updatedMessage
         });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Get unread message count
   getUnreadMessageCount = async (request, response) => {
      try {
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.params.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;

         // If chatId is provided, get unread count for specific chat
         // Otherwise, get counts for all chats
         const chatIdProvided = request.params.chatId !== undefined;

         // Get user
         const user = await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: request.params.userPhoneNumber
         });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response
         );
         if (userValidation) return userValidation;

         // Get unread count
         if (chatIdProvided) {
            const unreadCount = await ServiceFactory.getMessageService.getUnreadMessageCount(
               request.params.chatId,
               user._id.toString()
            );
            return response.json({ chatId: request.params.chatId, unreadCount });
         } else {
            // Get all chats for user
            const chatsQuery = ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery({
               $or: [
                  { mainUserId: user._id.toString() },
                  { participants: user._id.toString() },
               ],
            });
            const chats = await chatsQuery.lean();

            // Get unread counts for each chat
            const unreadCounts = await Promise.all(
               chats.map(async chat => {
                  const count = await ServiceFactory.getMessageService.getUnreadMessageCount(
                     chat._id.toString(),
                     user._id.toString()
                  );
                  return {
                     chatId: chat._id.toString(),
                     unreadCount: count
                  };
               })
            );

            return response.json({
               totalUnreadCount: unreadCounts.reduce((sum, item) => sum + item.unreadCount, 0),
               chatUnreadCounts: unreadCounts
            });
         }
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };

   // Get threaded replies for a message
   getMessageReplies = async (request, response) => {
      try {
         const messageIdValidation = await ExceptionHelper.validate(
            request.params.messageId,
            400,
            `messageId is not provided!`,
            response
         );
         if (messageIdValidation) return messageIdValidation;

         // Get the parent message
         const parentMessage = await ServiceFactory.getMessageService.getDocumentById(
            request.params.messageId
         );
         const parentMessageValidation = await ExceptionHelper.validate(
            parentMessage,
            400,
            `Parent message doesn't exist!`,
            response
         );
         if (parentMessageValidation) return parentMessageValidation;

         // Get all replies to this message
         const replies = await ServiceFactory.getMessageService.getRepliesForMessage(
            parentMessage._id.toString()
         );

         return response.json({
            parentMessage,
            replies,
            totalReplies: replies.length
         });
      } catch (exception) {
         return response.status(500).json({ error: exception.message });
      }
   };


   //event database post methods
   async postMessageToDb(mainUser, participants, message, chatId, replyToId = null) {
      //in the case of building chat history, we shouldn't let the application crash
      //websockets are realtime, and throwing exceptions can lead to bad user experience.
      //persistence of chat should take second priority so
      //if a chat doesn't exist, or if an XYZ user is missing from the user tble dont persist anything and send back an appropriate response, or log error etc
      const mainUserPhoneNumberUserObject =
         await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: mainUser,
         });
      if (await CommonUtils.isValueNull(mainUserPhoneNumberUserObject)) {
         return null;
      }

      const targetUserPhoneNumberUserObjects =
         await ServiceFactory.getUserService.getDocumentsByCustomFilters({
            phoneNumber: { $in: participants },
         });
      if (targetUserPhoneNumberUserObjects.length != participants.length) {
         return null;
      }

      const mappedTargetUserPhoneNumbersToId =
         targetUserPhoneNumberUserObjects.map((user) => user._id.toString());
      const mappedMainUserId = mainUserPhoneNumberUserObject._id.toString();

      // Prepare message data
      const messageData = {
         senderId: mappedMainUserId,
         receiverIds: mappedTargetUserPhoneNumbersToId,
         chatId: chatId,
         content: message,
      };
      
      // Add reply reference if this is a reply
      if (replyToId) {
         messageData.replyToId = replyToId;
      }

      return await ServiceFactory.getMessageService.saveDocument(messageData);
   }
}
module.exports = MessageController;