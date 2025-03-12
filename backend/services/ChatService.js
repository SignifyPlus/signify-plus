const AbstractService = require('./AbstractService')
const EventFactory = require("../factories/eventFactory.js");
const EventConstants = require("../constants/eventConstants.js");
const SignifyException = require('../exception/SignifyException.js');
class ChatService extends AbstractService {
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
        //i think its good to invoke the chat save event here, regardless from which controller it was executed - keep things centralized too
        const chat = await super.saveDocument(data);
        if (chat === null || chat == undefined) {
            return new SignifyException(400, `Couldn't save chat - please look at the data ${data}`);
        }
        //trigger chat event
        EventFactory.getEventDispatcher.dispatchEvent(EventConstants.CHAT_CREATED_EVENT, data);
        return chat;
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

module.exports = ChatService;