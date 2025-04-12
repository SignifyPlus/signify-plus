const ServiceFactory = require('../factories/serviceFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const mongoose = require('mongoose');
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
         const chatsQuery =
            ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery({
               $or: [
                  //checks in both mainUserId + participants!
                  { mainUserId: userObject._id.toString() },
                  { participants: userObject._id.toString() },
               ],
            });
         const chats = await chatsQuery.populate({
            path: 'mainUserId participants',
            select: 'phoneNumber name',
         });
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

         const retrievedChat =
            ServiceFactory.getMessageService.getDocumentsByCustomFiltersQuery({
               chatId: new mongoose.Types.ObjectId(request.params.chatId),
            });
         const populatedChatData = await retrievedChat.populate({
            path: 'senderId receiverIds',
            select: 'name phoneNumber',
         });
         response.json({
            messages: populatedChatData,
            totalNumberOfMessages: populatedChatData.length,
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
         return await chatsQuery.populate({
            path: 'mainUserId participants',
            select: 'phoneNumber',
         });
      } catch (exception) {
         return new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
      }
   }

   async #getUserChats(chats) {
      const chatObjects = [];
      const ZERO_INDEX = 0;
      for (const chat of chats) {
         const messages =
            await ServiceFactory.getMessageService.getDocumentsByCustomFiltersAndSortByCreatedAt(
               { chatId: chat._id.toString() },
            );
         const chatObject = chat.toObject();
         chatObject.lastMessage =
            messages == null || messages.length == ZERO_INDEX
               ? 'Chat is Empty - No last Message available!'
               : messages[ZERO_INDEX].content;
         chatObject.totalNumberOfMessagesInChat =
            messages == null ? 0 : messages.length;
         chatObjects.push(chatObject);
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
      try {
         const chat = await ServiceFactory.getChatService.saveDocument(
            {
               mainUserId: mainUserPhoneNumberUserObject._id.toString(),
               participants: particpantsUserObjects.map((participant) =>
                  participant._id.toString(),
               ),
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
      var chatId = null;
      for (var i = 0; i < cachedChats.length; i++) {
         ///the best way is to combine mainPhoneNumber and targetPhoneNumbers in an array
         //and match them with the array from the chat (mainuserIdPhoneNumber and participantsPhoneNumbers)
         //this way if we have an exact match, that's the chat
         const chatPhoneNumbers = [
            ...cachedChats[i].participants,
            cachedChats[i].mainUserId,
         ];
         chatPhoneNumbers.sort();
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
            chatId = cachedChats[i]._id.toString();
            break;
         }
      }
      return chatId;
   }
}
module.exports = ChatController;
