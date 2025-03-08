const EventFactory = require("../../factories/eventFactory.js");
const EventConstants = require("../../constants/eventConstants.js");
class MessageEvent {
    constructor(){
        //registers one of the message Events!
        EventFactory.getEventDispatcher().registerListener(EventConstants.MESSAGE_INGEST_EVENT, IngestMessages);
    }

    async IngestMessages(message) {
        //continue
    }
}


module.exports = MessageEvent;