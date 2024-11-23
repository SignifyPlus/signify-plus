const AbstractService = require('./AbstractService')
class CallHistoryService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }
    async getDocument() {
        super.getDocument();
    }

    async getDocumentById(objectId) {
        super.getDocumentById(objectId)
    }

    async updateDocument(schemaModel, filterConditions, updateFields) {
        super.updateDocument(schemaModel, filterConditions, updateFields);
    }

    async saveDocument(schemaModel,data) {
        super.saveDocument(schemaModel, data);
    }

    async deleteDocument(schemaModel, filterConditions) {
        super.deleteDocument(schemaModel, filterConditions);
    }
}

module.exports = CallHistoryService;