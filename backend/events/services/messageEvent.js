const EventConstants = require("../../constants/eventConstants.js");
const ControllerFactory = require("../../factories/controllerFactory.js");
class MessageEvent {
    constructor(eventDispatcher){
        //registers one of the message Events!
        eventDispatcher.registerListener(EventConstants.MESSAGE_INGEST_EVENT, this.IngestMessage.bind(this));
    }

    async IngestMessage(from, to, message) {
        //for persisting to the backend
        const response = await ControllerFactory.getMessageController().postMessage({mainUserPhoneNumber: from , targetUserPhoneNumbers: to , message: message})
        return response;
    }
}



module.exports = MessageEvent;