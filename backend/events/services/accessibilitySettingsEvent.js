const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class AccessibilitySettingsEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.ACCESSIBILITY_SETTINGS_EVENT,
         this.createAccessibilitySettings.bind(this),
      );
   }

   async createAccessibilitySettings(userId) {
      LoggerFactory.getApplicationLogger.info(
         `Creating default accessibility settings for the user ${userId} via the accessibility settings event...`,
      );
      const response =
         await ControllerFactory.getSettingsController().createSettings(userId);
      return response;
   }
}

module.exports = AccessibilitySettingsEvent;
