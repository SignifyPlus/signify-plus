const AbstractService = require('./AbstractService')
class ForumPermissionsService extends AbstractService {
    constructor(schemaModel) {
        return super(schemaModel);
    }
    async getDocument() {
        return super.getDocument();
    }

    async getDocumentById(objectId) {
        return super.getDocumentById(objectId)
    }

    async updateDocument(filterConditions, updateFields) {
        return super.updateDocument(filterConditions, updateFields);
    }

    async saveDocument(data) {
        return super.saveDocument(data);
    }

    async deleteDocument(filterConditions) {
        return super.deleteDocument(filterConditions);
    }
}

module.exports = ForumPermissionsService;