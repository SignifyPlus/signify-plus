const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class UserAuthenticationEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.USER_AUTHENTICAITON_EVENT,
         this.createUserAuthenticationRecord.bind(this),
      );

      EventDispatcher.registerListener(
         EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
         this.updateUserAuthenticationRecord.bind(this),
      );
   }

   async createUserAuthenticationRecord(userData) {
      LoggerFactory.getApplicationLogger.info(
         `Creating default user authentication record for the user ${JSON.stringify(userData)} via the user authentication event...`,
      );
      const response =
         await ControllerFactory.getUserAuthenticationController().createDefaultUserAuthenticationRecord(
            userData,
         );
      return response;
   }

   async updateUserAuthenticationRecord(data) {
      LoggerFactory.getApplicationLogger.info(
         `Updating user authentication record for the userId: ${data.userId}, status: ${data.isVerified}, token: ${data.refreshToken} via the user authentication event...`,
      );
      const response =
         await ControllerFactory.getUserAuthenticationController().updateUserAuthenticationViaEvent(
            data,
         );
      return response;
   }
}

module.exports = UserAuthenticationEvent;
