const ControllerFactory = require('../../factories/controllerFactory.js');
class MessageSocketUtils {
   static async prepareChatQueueData(data, chatId) {
      return {
         data: data,
         chatId: chatId,
      };
   }

   static async cacheChats() {
      return await ControllerFactory.getChatController().getAllChats();
   }

   static async filterChat(cachedChats, targetPhoneNumbers, senderPhoneNumber) {
      return await ControllerFactory.getChatController().filterChat(
         cachedChats,
         [...targetPhoneNumbers, senderPhoneNumber],
      );
   }

   static async createNewChat(mainUserPhoneNumber, participants) {
      return await ControllerFactory.getChatController().createAndPostProcessChats(
         mainUserPhoneNumber,
         participants,
      );
   }
}

module.exports = MessageSocketUtils;
