const ServiceFactory = require('../factories/serviceFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const mongoose = require('mongoose');
const ControllerConstants = require('../constants/controllerConstants.js');
const CommonUtils = require('../utilities/commonUtils.js');
class ChatController {
   constructor() {}

   initializeEmptyChat = async (request, response) => {
      try {
         const result = await this.createAndPostProcessChats(
            request.body.mainUserPhoneNumber,
            request.body.participants,
         );
         if (result.exception)
            return response
               .status(result.exception.status)
               .json(result.exception.loadResult());

         response.json(result.data);
      } catch (exception) {
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   getChatByPhoneNumber = async (request, response) => {
      try {
         const phoneNumberValidation = await ExceptionHelper.validate(
            request.params.phoneNumber,
            400,
            `phoneNumber is not provided.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const userObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.params.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            userObject,
            400,
            `User doesn't exist!.`,
            response,
         );
         if (userValidation) return userValidation;
         const chatsQuery =
            ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery({
               $or: [
                  //checks in both mainUserId + participants!
                  { mainUserId: userObject._id.toString() },
                  { participants: userObject._id.toString() },
               ],
            });
         const chats = await chatsQuery
            .populate({
               path: 'mainUserId participants',
               select: 'phoneNumber name profilePicture',
            })
            .sort({ isPinned: -1, lastActivity: -1 }) // Sort by pinned status first, then by activity
            .lean();
         const userChats = await this.#getUserChats(chats);
         response.json(await this.#postProcessChats(userChats));
      } catch (exception) {
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   getChatHistoryById = async (request, response) => {
      try {
         const chatIdValidation = await ExceptionHelper.validate(
            request.params.chatId,
            400,
            `chatId is not provided.`,
            response,
         );
         if (chatIdValidation) return chatIdValidation;

         // First check if chat exists and is not deleted
         const chat = await ServiceFactory.getChatService.getDocumentById(
            request.params.chatId,
         );
         if (!chat) {
            return response.status(404).json({
               error: 'Chat not found',
            });
         }

         // Get non-deleted messages for this chat
         const retrievedChat =
            ServiceFactory.getMessageService.getDocumentsByCustomFiltersQuery({
               chatId: new mongoose.Types.ObjectId(request.params.chatId),
               isDeleted: false, // Only show non-deleted messages
            });

         const populatedChatData = await retrievedChat
            .populate({
               path: 'senderId receiverIds', // Basic user info
               select: 'name phoneNumber profilePicture',
            })
            .populate({
               path: 'replyToId', // For reply functionality
               populate: {
                  path: 'senderId',
                  select: 'name phoneNumber profilePicture',
               },
               select: 'content senderId', // Include content and sender of replied message
            })
            .sort({ createdAt: 1 }) // Sort by creation time
            .lean();

         // Get pinned messages for this chat
         const pinnedMessages =
            await ServiceFactory.getMessageService.getDocumentsByCustomFilters({
               chatId: new mongoose.Types.ObjectId(request.params.chatId),
               isPinned: true,
               isDeleted: false,
            });

         // Count unread messages if a user is specified
         let unreadCount = 0;
         if (request.query.userPhoneNumber) {
            // First get the user
            const user =
               await ServiceFactory.getUserService.getDocumentByCustomFilters({
                  phoneNumber: request.query.userPhoneNumber,
               });

            if (user) {
               unreadCount =
                  await ServiceFactory.getMessageService.getUnreadMessageCount(
                     request.params.chatId,
                     user._id.toString(),
                  );
            }
         }

         response.json({
            messages: populatedChatData,
            totalNumberOfMessages: populatedChatData.length,
            pinnedMessages: pinnedMessages || [],
            unreadCount: unreadCount,
         });
      } catch (exception) {
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   async getAllChats() {
      try {
         const chatsQuery = ServiceFactory.getChatService.getDocumentsQuery();
         return await chatsQuery
            .populate({
               path: 'mainUserId participants',
               select: 'phoneNumber profilePicture',
            })
            .lean();
      } catch (exception) {
         return new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
      }
   }
   // Delete entire chat
   softDeleteChat = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response,
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;

         const chatIdValidation = await ExceptionHelper.validate(
            request.body.chatId,
            400,
            `chatId is not provided!`,
            response,
         );
         if (chatIdValidation) return chatIdValidation;

         // Get user by phone number
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.userPhoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response,
         );
         if (userValidation) return userValidation;

         // Get chat with proper ID
         const chat = await ServiceFactory.getChatService.getDocumentById(
            request.body.chatId,
         );
         const chatValidation = await ExceptionHelper.validate(
            chat,
            400,
            `Chat doesn't exist!`,
            response,
         );
         if (chatValidation) return chatValidation;

         // Check if user is part of this chat - comparing ObjectIds as strings
         const isUserPartOfChat =
            chat.mainUserId.toString() === user._id.toString() ||
            chat.participants.some((p) => p.toString() === user._id.toString());

         if (!isUserPartOfChat) {
            return response.status(403).json({
               error: 'User is not part of this chat',
            });
         }

         // Soft delete the chat
         const updatedChat = await ServiceFactory.getChatService.softDeleteChat(
            chat._id.toString(),
            user._id.toString(),
            mongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return response.json(updatedChat);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         return response.status(500).json({ error: exception.message });
      }
   };
   // Pin a chat
   pinChat = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response,
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;
         const chatIdValidation = await ExceptionHelper.validate(
            request.body.chatId,
            400,
            `chatId is not provided!`,
            response,
         );
         if (chatIdValidation) return chatIdValidation;
         const isPinnedValidation = await ExceptionHelper.validate(
            request.body.isPinned,
            400,
            `isPinned (boolean) is required!`,
            response,
         );
         if (isPinnedValidation) return isPinnedValidation;
         // Get user
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.userPhoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response,
         );
         if (userValidation) return userValidation;
         // Get chat
         const chat = await ServiceFactory.getChatService.getDocumentById(
            request.body.chatId,
         );
         const chatValidation = await ExceptionHelper.validate(
            chat,
            400,
            `Chat doesn't exist!`,
            response,
         );
         if (chatValidation) return chatValidation;
         // Check if user is part of this chat
         const isUserPartOfChat =
            chat.mainUserId.toString() === user._id.toString() ||
            chat.participants.some((p) => p.toString() === user._id.toString());
         if (!isUserPartOfChat) {
            return response.status(403).json({
               error: 'User is not part of this chat',
            });
         }
         // Update pin status
         const updatedChat = await ServiceFactory.getChatService.toggleChatPin(
            chat._id.toString(),
            user._id.toString(),
            request.body.isPinned,
            mongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return response.json({
            message: request.body.isPinned
               ? 'Chat pinned successfully'
               : 'Chat unpinned successfully',
            chat: updatedChat,
         });
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         return response.status(500).json({ error: exception.message });
      }
   };

   // Archive a chat
   archiveChat = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.userPhoneNumber,
            400,
            `userPhoneNumber is required!`,
            response,
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;
         const chatIdValidation = await ExceptionHelper.validate(
            request.body.chatId,
            400,
            `chatId is not provided!`,
            response,
         );
         if (chatIdValidation) return chatIdValidation;
         const isArchivedValidation = await ExceptionHelper.validate(
            request.body.isArchived,
            400,
            `isArchived (boolean) is required!`,
            response,
         );
         if (isArchivedValidation) return isArchivedValidation;
         // Get user
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.userPhoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `userPhoneNumber doesn't exist in the user table!`,
            response,
         );
         if (userValidation) return userValidation;
         // Get chat
         const chat = await ServiceFactory.getChatService.getDocumentById(
            request.body.chatId,
         );
         const chatValidation = await ExceptionHelper.validate(
            chat,
            400,
            `Chat doesn't exist!`,
            response,
         );
         if (chatValidation) return chatValidation;
         // Check if user is part of this chat
         const isUserPartOfChat =
            chat.mainUserId.toString() === user._id.toString() ||
            chat.participants.some((p) => p.toString() === user._id.toString());
         if (!isUserPartOfChat) {
            return response.status(403).json({
               error: 'User is not part of this chat',
            });
         }
         // Update archive status
         const updatedChat = await ServiceFactory.getChatService.toggleArchive(
            chat._id.toString(),
            user._id.toString(),
            request.body.isArchived,
            mongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return response.json({
            message: request.body.isArchived
               ? 'Chat archived successfully'
               : 'Chat unarchived successfully',
            chat: updatedChat,
         });
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   async #getUserChats(chats) {
      const chatObjects = [];
      const ZERO_INDEX = 0;
      for (const chat of chats) {
         if (await this.#isChatInvalid(chat)) {
            continue;
         }
         const messages =
            await ServiceFactory.getMessageService.getDocumentsByCustomFiltersAndSortByCreatedAt(
               {
                  chatId: chat._id.toString(),
                  isDeleted: false, // Only count non-deleted messages
               },
            );
         chat.lastMessage =
            messages == null || messages.length == ZERO_INDEX
               ? 'Chat is Empty - No last Message available!'
               : messages[ZERO_INDEX].content;
         chat.totalNumberOfMessagesInChat =
            messages == null ? 0 : messages.length;
         // Add unread count
         const unreadCount =
            messages?.filter(
               (msg) =>
                  !msg.isRead &&
                  msg.senderId.toString() !== chat.mainUserId._id.toString(),
            ).length || 0;
         chat.unreadCount = unreadCount;
         chatObjects.push(chat);
      }
      return chatObjects;
   }

   async #postProcessChats(chats) {
      chats.forEach((chat) => {
         const participantChatIds = chat.participants.map((p) =>
            p._id.toString(),
         );
         const mainUserId = chat.mainUserId._id.toString();
         if (!participantChatIds.includes(mainUserId)) {
            chat.participants.push(chat.mainUserId);
         }
      });
      return chats;
   }

   async createAndPostProcessChats(mainUserPhoneNumber, participants) {
      var mongooseSession =
         await ServiceFactory.getMongooseService.getMongooseSession();
      await ServiceFactory.getMongooseService.startMongooseTransaction(
         mongooseSession,
      );

      const mainUserPhoneNumberValidation = await ExceptionHelper.validate(
         mainUserPhoneNumber,
         400,
         `mainUserPhoneNumber is not provided.`,
      );
      if (mainUserPhoneNumberValidation)
         return new SignifyResult(null, mainUserPhoneNumberValidation);

      const participantsValidation = await ExceptionHelper.validate(
         participants,
         400,
         `participants array not provided. Please add the participants that will be participate in a chat - participants : [+905232314, +9023132145]`,
      );
      if (participantsValidation)
         return new SignifyResult(null, participantsValidation);

      const mainUserPhoneNumberUserObject =
         await ServiceFactory.getUserService.getDocumentByCustomFilters({
            phoneNumber: mainUserPhoneNumber,
         });
      const mainUserObjectValidation = await ExceptionHelper.validate(
         mainUserPhoneNumberUserObject,
         400,
         `mainUserPhoneNumber doesnt Exist in the user table!`,
      );
      if (mainUserObjectValidation)
         return new SignifyResult(null, mainUserObjectValidation);

      //participants validation
      const particpantsUserObjects =
         await ServiceFactory.getUserService.getDocumentsByCustomFilters({
            phoneNumber: { $in: participants },
         });
      if (particpantsUserObjects.length != participants.length) {
         return new SignifyResult(
            null,
            new SignifyException(
               400,
               `Not all phoneNumbers are registered to the User table - can't create a chat`,
            ),
         );
      }

      //check if a chat exists
      const participantsIdMap = particpantsUserObjects.map((participant) =>
         participant._id.toString(),
      );

      const existingChat = await this.#getExistingChats(
         mainUserPhoneNumberUserObject._id.toString(),
         participantsIdMap,
      );

      if (existingChat.length > 0) {
         return new SignifyResult(
            existingChat,
            new SignifyException(
               400,
               `A chat already exists between ${mainUserPhoneNumber} and ${participants} - chatId: ${existingChat[ControllerConstants.ZERO_INDEX]._id.toString()}`,
            ),
         );
      }

      try {
         const chat = await ServiceFactory.getChatService.saveDocument(
            {
               mainUserId: mainUserPhoneNumberUserObject._id.toString(),
               participants: participantsIdMap,
               lastActivity: new Date(),
            },
            mongooseSession,
         );
         const preprocessedChats = await this.#postProcessChats(chat);
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(preprocessedChats, null);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(
            null,
            new SignifyException(400, `Database Exception: ${exception}`),
         );
      }
   }

   //Helper Methods
   async filterChat(cachedChats, phoneNumbers) {
      var chat = null;
      for (var i = 0; i < cachedChats.length; i++) {
         ///the best way is to combine mainPhoneNumber and targetPhoneNumbers in an array
         //and match them with the array from the chat (mainuserIdPhoneNumber and participantsPhoneNumbers)
         //this way if we have an exact match, that's the chat
         const chatPhoneNumbers = [
            ...cachedChats[i].participants,
            cachedChats[i].mainUserId,
         ];
         //cases where mainUserId is a participant
         //no need to worry, since both arrays will have the phone numbers in the same format, so should be consistent
         chatPhoneNumbers.sort((a, b) =>
            a.phoneNumber.localeCompare(b.phoneNumber),
         );
         phoneNumbers.sort();
         //since sorted, the comparision will work
         //once compared, please also check that the length is exact or not - we should not be returning a chat where there are extra participants but the above two phoneNumbers are part of that chat
         //that will be a wrong chat then
         const perfectMatch =
            phoneNumbers.length == chatPhoneNumbers.length &&
            phoneNumbers.every(
               (value, index) => value == chatPhoneNumbers[index].phoneNumber,
            );
         if (perfectMatch) {
            chat = cachedChats[i];
            break;
         }
      }
      return chat;
   }

   async filterChatById(cachedChats, chatId) {
      var chat = null;
      for (var i = 0; i < cachedChats.length; i++) {
         if (cachedChats[i]._id.toString() == chatId) {
            return cachedChats[i];
         }
      }
      return chat;
   }

   async #getExistingChats(mainUserPhoneNumberId, participantsIdMap) {
      return await ServiceFactory.getChatService.getDocumentsByCustomFilters({
         mainUserId: mainUserPhoneNumberId,
         participants: {
            $all: participantsIdMap,
            $size: participantsIdMap.length,
         },
      });
   }

   async #isChatInvalid(chat) {
      if (
         chat == null ||
         chat == undefined ||
         chat.mainUserId == null ||
         chat.mainUserId == undefined ||
         chat.participants == null ||
         chat.participants == undefined
      ) {
         return true;
      }

      return false;
   }

   async updateChat(chatData) {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );

         if (
            (await CommonUtils.isValueNull(chatData)) ||
            (await CommonUtils.isValueNull(chatData._id))
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Chat data or chatId is null!`,
            );
            return new SignifyResult(null);
         }
         // Update chat
         const updatedChat = await ServiceFactory.getChatService.updateDocument(
            chatData._id,
            {
               pinnedBy: chatData.pinnedBy,
               archivedBy: chatData.archivedBy,
               deletedBy: chatData.deletedBy,
            },
            mongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(updatedChat);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return new SignifyResult(null, signifyException);
      }
   }
}
module.exports = ChatController;
