const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class MessageEvent {
   constructor() {
      //registers one of the message Events!
      EventDispatcher.registerListener(
         EventConstants.MESSAGE_INGEST_EVENT,
         this.IngestMessage.bind(this),
      );
   }

   async IngestMessage(messageObject) {
      //for persisting to the backend
      const response =
         await ControllerFactory.getMessageController().postMessageToDb(
            messageObject.senderPhoneNumber,
            messageObject.targetPhoneNumbers,
            messageObject.message,
            messageObject.chatId,
         );
      return response;
   }
}

module.exports = MessageEvent;
