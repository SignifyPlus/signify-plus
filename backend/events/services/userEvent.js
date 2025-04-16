const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class UserEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.UPDATE_USER_EVENT,
         this.updateUserData.bind(this),
      );
   }

   async updateUserData(userData) {
      LoggerFactory.getApplicationLogger.info(
         `Updating userData for the userId ${userData._id.toString()} via the user event...`,
      );
      const response =
         await ControllerFactory.getUserController().updateUserData(userData);
      return response;
   }
}

module.exports = UserEvent;
