const EventConstants = require("../../constants/eventConstants.js");
const ControllerFactory = require("../../factories/controllerFactory.js");
class MessageEvent {
    constructor(eventDispatcher){
        //registers one of the message Events!
        eventDispatcher.registerListener(EventConstants.MESSAGE_INGEST_EVENT, this.IngestMessage.bind(this));
    }

    async IngestMessage(messageObject) {
        //for persisting to the backend
        console.log(messageObject);
        //need to fix this
        const response = await ControllerFactory.getMessageController().postMessageToDb(messageObject.senderPhoneNumber, messageObject.targetPhoneNumbers, messageObject.message);
        console.log(response);
        return response;
    }
}



module.exports = MessageEvent;