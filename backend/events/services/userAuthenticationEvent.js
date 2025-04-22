const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class UserAuthenticationEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.USER_AUTHENTICAITON_EVENT,
         this.createDefaultUserAuthenticationRecord.bind(this),
      );
   }

   async createDefaultUserAuthenticationRecord(userId) {
      LoggerFactory.getApplicationLogger.info(
         `Creating default user authentication record for the user ${userId} via the user authentication event...`,
      );
      const response =
         await ControllerFactory.getUserAuthenticationController().createDefaultUserAuthenticationRecord(
            userId,
         );
      return response;
   }
}

module.exports = UserAuthenticationEvent;
