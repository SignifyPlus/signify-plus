const AbstractService = require('./AbstractService')
class CallHistoryService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }
    async getDocuments() {
        return await super.getDocuments();
    }

    async getDocumentByCustomFilters(filterConditions) {
        return await super.getDocumentByCustomFilters(filterConditions);
    }

    async getDocumentById(objectId) {
        return await super.getDocumentById(objectId)
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

module.exports = CallHistoryService;