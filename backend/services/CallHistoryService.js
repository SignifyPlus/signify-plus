const AbstractService = require('./AbstractService');
class CallHistoryService extends AbstractService {
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

   //query methods
   getDocumentsByCustomFiltersQuery(filterConditions) {
      return super.getDocumentsByCustomFiltersQuery(filterConditions);
   }
}

module.exports = CallHistoryService;
