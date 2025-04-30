const ControllerFactory = require('../../factories/controllerFactory.js');
const ServiceFactory = require('../../factories/serviceFactory.js');
const mongoose = require('mongoose');

class MessageSocketUtils {
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
   // New utility methods for message actions

   static async validateMessageOwnership(messageId, senderPhoneNumber) {
      try {
         // Get sender user
         const sender =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: senderPhoneNumber,
            });

         if (!sender) {
            return {
               success: false,
               error: 'Sender phone number not found',
            };
         }

         // Get message
         const message =
            await ServiceFactory.getMessageService.getDocumentById(messageId);

         if (!message) {
            return {
               success: false,
               error: 'Message not found',
            };
         }

         // Validate ownership
         if (message.senderId.toString() !== sender._id.toString()) {
            return {
               success: false,
               error: 'User does not own this message',
            };
         }

         return {
            success: true,
            data: message,
         };
      } catch (error) {
         return {
            success: false,
            error: `Error validating message ownership: ${error.message}`,
         };
      }
   }

   static async editMessage(messageId, newContent) {
      try {
         return await ServiceFactory.getMessageService.editMessage(
            messageId,
            newContent,
         );
      } catch (error) {
         return null;
      }
   }

   static async softDeleteMessage(messageId) {
      try {
         const result =
            await ServiceFactory.getMessageService.softDeleteMessage(messageId);
         const message =
            await ServiceFactory.getMessageService.getDocumentById(messageId);
         return message;
      } catch (error) {
         return null;
      }
   }

   static async pinMessage(messageId, userPhoneNumber, isPinned) {
      try {
         // Get user
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: userPhoneNumber,
            });

         if (!user) {
            return {
               success: false,
               error: 'User not found',
            };
         }

         // Get message
         const message =
            await ServiceFactory.getMessageService.getDocumentById(messageId);

         if (!message) {
            return {
               success: false,
               error: 'Message not found',
            };
         }

         // Get chat
         const chat = await ServiceFactory.getChatService.getDocumentById(
            message.chatId,
         );

         if (!chat) {
            return {
               success: false,
               error: 'Chat not found',
            };
         }

         // Check if user is part of chat
         const isUserInChat =
            chat.mainUserId.toString() === user._id.toString() ||
            chat.participants.some((p) => p.toString() === user._id.toString());

         if (!isUserInChat) {
            return {
               success: false,
               error: 'User is not part of this chat',
            };
         }

         // Update pin status
         await ServiceFactory.getMessageService.pinMessage(messageId, isPinned);

         return {
            success: true,
            data: {
               messageId,
               chatId: message.chatId.toString(),
            },
         };
      } catch (error) {
         return {
            success: false,
            error: `Error pinning message: ${error.message}`,
         };
      }
   }

   static async getMessageRecipients(messageId) {
      try {
         const message =
            await ServiceFactory.getMessageService.getDocumentById(messageId);

         if (!message) {
            return [];
         }

         // Get chat
         const chat = await ServiceFactory.getChatService.getDocumentById(
            message.chatId,
         );

         if (!chat) {
            return [];
         }

         // Get all users in chat
         const allUserIds = [
            ...new Set([
               chat.mainUserId.toString(),
               ...chat.participants.map((p) => p.toString()),
            ]),
         ];

         // Get phone numbers
         const users =
            await ServiceFactory.getUserService.getDocumentsByCustomFilters({
               _id: {
                  $in: allUserIds.map((id) => new mongoose.Types.ObjectId(id)),
               },
            });

         return users.map((user) => user.phoneNumber);
      } catch (error) {
         return [];
      }
   }

   static async getChatParticipants(chatId) {
      try {
         const chat =
            await ServiceFactory.getChatService.getDocumentById(chatId);

         if (!chat) {
            return [];
         }

         // Get all users in chat
         const allUserIds = [
            ...new Set([
               chat.mainUserId.toString(),
               ...chat.participants.map((p) => p.toString()),
            ]),
         ];

         // Get phone numbers
         const users =
            await ServiceFactory.getUserService.getDocumentsByCustomFilters({
               _id: {
                  $in: allUserIds.map((id) => new mongoose.Types.ObjectId(id)),
               },
            });

         return users.map((user) => user.phoneNumber);
      } catch (error) {
         return [];
      }
   }
}

module.exports = MessageSocketUtils;
