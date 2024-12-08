const AbstractService = require('./AbstractService')
class GroupMemberService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }
    async getDocument() {
        return super.getDocument();
    }

    async getDocumentById(objectId) {
        return super.getDocumentById(objectId)
    }

    async updateDocument(schemaModel, filterConditions, updateFields) {
        return super.updateDocument(schemaModel, filterConditions, updateFields);
    }

    async saveDocument(schemaModel,data) {
        return super.saveDocument(schemaModel, data);
    }

    async deleteDocument(schemaModel, filterConditions) {
        return super.deleteDocument(schemaModel, filterConditions);
    }
}

module.exports = GroupMemberService;