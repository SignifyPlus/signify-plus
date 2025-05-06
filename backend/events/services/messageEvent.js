const EventConstants = require('../../constants/eventConstants.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class MessageEvent {
   constructor() {
      //registers one of the message Events!
      EventDispatcher.registerListener(
         EventConstants.MESSAGE_INGEST_EVENT,
         this.ingestMessage.bind(this),
      );

      EventDispatcher.registerListener(
         EventConstants.SOFT_DELETE_MESSAGE_EVENT,
         this.softDeleteMessages.bind(this),
      );
   }

   async ingestMessage(messageObject) {
      //for persisting to the backend
      const response =
         await ControllerFactory.getMessageController().postMessageToDb(
            messageObject.senderPhoneNumber,
            messageObject.targetPhoneNumbers,
            messageObject.message,
            messageObject.chatId,
            messageObject.replyToId, // Pass replyToId to postMessageToDb
         );
      return response;
   }

   async softDeleteMessages(messageObject) {
      LoggerFactory.getApplicationLogger.info(
         `Soft deleing messages for the userId: ${messageObject.userId}, and chat: ${messageObject.chatId} via the user soft delete messages event...`,
      );
      const response =
         await ControllerFactory.getMessageController().softDeleteMessages(
            messageObject,
         );
      return response;
   }
}

module.exports = MessageEvent;
