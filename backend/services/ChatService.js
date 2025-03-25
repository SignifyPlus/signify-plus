const AbstractService = require('./AbstractService')
const EventConstants = require("../constants/eventConstants.js");
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require("../events/eventDispatcher.js");
class ChatService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }

    //result methods
    async getDocuments(session = null) {
        return await super.getDocuments(session);
    }
    
    async getDocumentById(objectId, session = null) {
        return await super.getDocumentById(objectId, session);
    }

    async getDocumentsByCustomFilters(filterConditions, session = null) {
        return await super.getDocumentsByCustomFilters(filterConditions, session);
    }

    async getDocumentByCustomFilters(filterConditions, session = null) {
        return await super.getDocumentByCustomFilters(filterConditions, session);
    }

    async updateDocument(filterConditions, updateFields, session = null) {
        return await super.updateDocument(filterConditions, updateFields, session);
    }

    async saveDocument(data, session = null) {
        //i think its good to invoke the chat save event here, regardless from which controller it was executed - keep things centralized too
        const chat = await super.saveDocument(data, session);
        if (chat === null || chat == undefined) {
            return new SignifyException(400, `Couldn't save chat - please look at the data ${data}`);
        }
        //trigger chat event
        await EventDispatcher.dispatchEvent(EventConstants.CHAT_CREATED_EVENT, data);
        return chat;
    }

    async saveDocuments(data, session = null) {
        return await super.saveDocuments(data, session);
    }

    async deleteDocument(filterConditions, session = null) {
        return await super.deleteDocument(filterConditions, session);
    }

    async deleteDocumentById(objectId, session = null) {
        return await super.deleteDocumentById(objectId, session);
    }

    async deleteDocuments(filterConditions, session = null) {
        return await super.deleteDocuments(filterConditions, session);
    }

    //query methods
    getDocumentsByCustomFiltersQuery(filterConditions, session = null) {
        return super.getDocumentsByCustomFiltersQuery(filterConditions, session);
    }

    getDocumentsQuery(session = null) {
        return super.getDocumentsQuery(session);
    }
}

module.exports = ChatService;