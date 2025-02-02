const AbstractService = require('./AbstractService')
class ForumThreadService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }
    async getDocument() {
        return await super.getDocument();
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

module.exports = ForumThreadService;