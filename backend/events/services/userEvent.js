const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class UserEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.UPDATE_USER_EVENT,
         this.updateUserData.bind(this),
      );
   }

   async updateUserData(userData) {
      const response =
         await ControllerFactory.getUserController().updateUserData(userData);
      return response;
   }
}

module.exports = UserEvent;
