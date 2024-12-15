const AbstractService = require('./AbstractService')
class ForumPermissionsService extends AbstractService {
    constructor(schemaModel) {
        return super(schemaModel);
    }
    async getDocument() {
        return await super.getDocument();
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

module.exports = ForumPermissionsService;