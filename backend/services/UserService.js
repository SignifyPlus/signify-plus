const AbstractService = require('./AbstractService')
class UserService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
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
}

module.exports = UserService;