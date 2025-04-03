const AbstractService = require('./AbstractService');
class ForumMemberService extends AbstractService {
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
      return await super.saveDocument(data, session);
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
}

module.exports = ForumMemberService;
