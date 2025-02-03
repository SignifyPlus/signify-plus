const AbstractService = require('./AbstractService')
class NotificationService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }

    async getDocuments() {
        return await super.getDocuments();
    }
    
    async getDocumentById(objectId) {
        return await super.getDocumentById(objectId)
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

    async deleteDocument(filterConditions) {
        return await super.deleteDocument(filterConditions);
    }

    async deleteDocumentById(objectId) {
        return await super.deleteDocumentById(objectId);
    }
}

module.exports = NotificationService;