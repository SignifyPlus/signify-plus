const AbstractService = require('./AbstractService');
class MessageService extends AbstractService {
   constructor(schemaModel) {
      super(schemaModel);
   }

   //result methods
   async getDocuments() {
      return await super.getDocuments();
   }

   async getDocumentById(objectId) {
      return await super.getDocumentById(objectId);
   }

   async getDocumentsByCustomFilters(filterConditions) {
      return await super.getDocumentsByCustomFilters(filterConditions);
   }

   async getDocumentByCustomFilters(filterConditions) {
      return await super.getDocumentByCustomFilters(filterConditions);
   }

   async updateDocument(filterConditions, updateFields) {
      return await super.updateDocument(filterConditions, updateFields);
   }

   async saveDocument(data) {
      return await super.saveDocument(data);
   }

   async saveDocuments(data) {
      return await super.saveDocuments(data);
   }

   async deleteDocument(filterConditions) {
      return await super.deleteDocument(filterConditions);
   }

   async deleteDocumentById(objectId) {
      return await super.deleteDocumentById(objectId);
   }

   async deleteDocuments(filterConditions) {
      return await super.deleteDocuments(filterConditions);
   }

   async findLatestDocument(filterConditions) {
      return await this.schemaModel
         .findOne(filterConditions)
         .sort({ createdAt: -1 })
         .lean(); //lean for faster execution, returns plain javascript object without conversion (doesn't return mongoose document)
   }

   async getDocumentsByCustomFiltersAndSortByCreatedAt(filterConditions) {
      return await this.schemaModel
         .find(filterConditions)
         .sort({ createdAt: -1 })
         .lean();
   }

   // New methods for additional functionality
   async markMessageAsRead(messageId, session = null) {
      return await super.updateDocument(
         { _id: messageId },
         { isRead: true },
         session
      );
   }

   async markMessagesAsRead(messageIds, session = null) {
      return await this.schemaModel.updateMany(
         { _id: { $in: messageIds } },
         { isRead: true },
         { session }
      );
   }

   async markMessagesAsUnread(messageIds, session = null) {
      return await this.schemaModel.updateMany(
         { _id: { $in: messageIds } },
         { isRead: false },
         { session }
      );
   }

   async editMessage(messageId, newContent, session = null) {
      return await super.updateDocument(
         { _id: messageId },
         { 
            content: newContent,
            isEdited: true 
         },
         session
      );
   }

   async softDeleteMessage(messageId, session = null) {
      return await super.updateDocument(
         { _id: messageId },
         { isDeleted: true },
         session
      );
   }

   async pinMessage(messageId, isPinned = true, session = null) {
      return await super.updateDocument(
         { _id: messageId },
         { isPinned },
         session
      );
   }

   async getUnreadMessageCount(chatId, userId) {
      return await this.schemaModel.countDocuments({
         chatId,
         receiverIds: userId,
         isRead: false,
         isDeleted: false
      });
   }

   async getRepliesForMessage(messageId) {
      return await this.schemaModel
         .find({ 
            replyToId: messageId,
            isDeleted: false
         })
         .populate({
            path: 'senderId',
            select: 'name phoneNumber',
         })
         .sort({ createdAt: 1 })
         .lean();
   }


   //query methods
   getDocumentsByCustomFiltersQuery(filterConditions) {
      return super.getDocumentsByCustomFiltersQuery(filterConditions);
   }
}

module.exports = MessageService;
