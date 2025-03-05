const AbstractService = require('./AbstractService')
class MessageService extends AbstractService {
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

    async findLatestDocument(filterConditions) {
        return await this.schemaModel.findOne(filterConditions).sort({createdAt: -1}).lean(); //lean for faster execution, returns plain javascript object without conversion (doesn't return mongoose document)
    }

    async getDocumentsByCustomFiltersAndSortByCreatedAt(filterConditions) {
        return await this.schemaModel.find(filterConditions).sort({createdAt: -1}).lean();
    }

    //query methods
    getDocumentsByCustomFiltersQuery(filterConditions) {
        return super.getDocumentsByCustomFiltersQuery(filterConditions);
    }
}

module.exports = MessageService;