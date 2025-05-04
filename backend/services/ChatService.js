const AbstractService = require('./AbstractService');
const EventConstants = require('../constants/eventConstants.js');
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require('../events/eventDispatcher.js');
class ChatService extends AbstractService {
   constructor(schemaModel) {
      super(schemaModel);
   }

   //result methods
   async getDocuments(session = null) {
      return await super.getDocuments(session);
   }

   async getDocumentById(objectId, session = null) {
      return await super.getDocumentById(objectId, session);
   }

   async getDocumentsByCustomFilters(filterConditions, session = null) {
      return await super.getDocumentsByCustomFilters(filterConditions, session);
   }

   async getDocumentByCustomFilters(filterConditions, session = null) {
      return await super.getDocumentByCustomFilters(filterConditions, session);
   }

   async updateDocument(filterConditions, updateFields, session = null) {
      return await super.updateDocument(
         filterConditions,
         updateFields,
         session,
      );
   }

   async saveDocument(data, session = null) {
      //i think its good to invoke the chat save event here, regardless from which controller it was executed - keep things centralized too
      const chat = await super.saveDocument(data, session);
      if (chat === null || chat == undefined) {
         return new SignifyException(
            400,
            `Couldn't save chat - please look at the data ${data}`,
         );
      }
      //trigger chat event
      await EventDispatcher.dispatchEvent(
         EventConstants.CHAT_CREATED_EVENT,
         data,
      );
      return chat;
   }

   async saveDocuments(data, session = null) {
      return await super.saveDocuments(data, session);
   }

   async deleteDocument(filterConditions, session = null) {
      return await super.deleteDocument(filterConditions, session);
   }

   async deleteDocumentById(objectId, session = null) {
      return await super.deleteDocumentById(objectId, session);
   }

   async deleteDocuments(filterConditions, session = null) {
      return await super.deleteDocuments(filterConditions, session);
   }

   //query methods
   getDocumentsByCustomFiltersQuery(filterConditions, session = null) {
      return super.getDocumentsByCustomFiltersQuery(filterConditions, session);
   }

   getDocumentsQuery(session = null) {
      return super.getDocumentsQuery(session);
   }

   // New methods for enhanced features
   // Soft delete a chat
   async softDeleteChat(chatId, userId, session = null) {
      const updatedChat = await super.updateDocument(
         { _id: chatId },
         {
            $addToSet: { deletedBy: userId }, //ensures we dont overwrite the previous array + addToSet ensures the array/set is unique
            lastActivity: new Date(),
         },
         session,
      );

      //trigger the event for the messages (no need to await. Should be async, since the user deleted the chat)
      EventDispatcher.dispatchEvent(EventConstants.SOFT_DELETE_MESSAGE_EVENT, {
         chatId: chatId,
         userId: userId,
      });

      return updatedChat;
   }

   // Pin or unpin a chat
   async toggleChatPin(chatId, userId, isPinned, session = null) {
      if (isPinned) {
         // Add user to pinnedBy array if not already there
         return await this.schemaModel.findByIdAndUpdate(
            chatId,
            {
               isPinned: isPinned,
               $addToSet: { pinnedBy: userId },
               lastActivity: new Date(),
            },
            { new: true, session },
         );
      } else {
         // Remove user from pinnedBy array
         return await this.schemaModel
            .findByIdAndUpdate(
               chatId,
               {
                  $pull: { pinnedBy: userId },
                  lastActivity: new Date(),
               },
               { new: true, session },
            )
            .then((chat) => {
               // If no users have this chat pinned anymore, set isPinned to false
               if (chat.pinnedBy.length === 0) {
                  return this.schemaModel.findByIdAndUpdate(
                     chatId,
                     { isPinned: isPinned },
                     { new: true, session },
                  );
               }
               return chat;
            });
      }
   }

   // archive or unarchive a chat
   async toggleArchive(chatId, userId, isArchived, session = null) {
      if (isArchived) {
         // Add user to archivedBy array if not already there
         return await this.schemaModel.findByIdAndUpdate(
            chatId,
            {
               isArchived: isArchived,
               $addToSet: { archivedBy: userId },
               lastActivity: new Date(),
            },
            { new: true, session },
         );
      } else {
         // Remove user from pinnedBy array
         return await this.schemaModel
            .findByIdAndUpdate(
               chatId,
               {
                  $pull: { archivedBy: userId },
                  lastActivity: new Date(),
               },
               { new: true, session },
            )
            .then((chat) => {
               // If no users have this chat pinned anymore, set isPinned to false
               if (chat.archivedBy.length === 0) {
                  return this.schemaModel.findByIdAndUpdate(
                     chatId,
                     { isArchived: isArchived },
                     { new: true, session },
                  );
               }
               return chat;
            });
      }
   }

   // Update lastActivity timestamp for a chat
   async updateChatActivity(chatId, session = null) {
      return await super.updateDocument(
         { _id: chatId },
         { lastActivity: new Date() },
         session,
      );
   }

   // Get chats sorted by activity (with pinned chats at top)
   async getChatsForUser(userId, session = null) {
      return await this.schemaModel
         .find({
            $or: [{ mainUserId: userId }, { participants: userId }],
         })
         .sort({ lastActivity: -1 })
         .populate({
            path: 'mainUserId participants',
            select: 'phoneNumber name',
         })
         .session(session)
         .lean();
   }
}

module.exports = ChatService;
