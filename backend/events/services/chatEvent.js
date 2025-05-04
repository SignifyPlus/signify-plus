const EventConstants = require('../../constants/eventConstants.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
const MessageSocketUtils = require('../../webSockets/utils/messageSocketUtils.js');
class ChatEvent {
   constructor() {
      //registers one of the chat Events!
      EventDispatcher.registerListener(
         EventConstants.UNDELETED_USER_FROM_CHAT_EVENT,
         this.undeleteUserFromChat.bind(this),
      );
   }

   async undeleteUserFromChat(chatData) {
      //for persisting to the backend
      LoggerFactory.getApplicationLogger.info(
         `Updating chat: ${chatData.chat._id.toString()} via the chat update event...`,
      );
      const updatedChat = await MessageSocketUtils.undeleteUser(
         chatData.chat,
         chatData.participants,
      );
      const response =
         await ControllerFactory.getChatController().updateChat(updatedChat);
      return response;
   }
}

module.exports = ChatEvent;
