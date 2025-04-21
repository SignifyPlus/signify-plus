/**
 * EventFactory takes on the responsibility of initializing and providing instances
 * of all the event classes that are to be utilized throughout the application's runtime.
 */

const AccessibilitySettingsEvent = require('../events/services/accessibilitySettingsEvent.js');
const MessageEvent = require('../events/services/messageEvent.js');
const UserEvent = require('../events/services/userEvent.js');

class EventFactory {
   //private fields
   /**
    * @private
    * @type {MessageEvent | null}
    */
   static #messageEvent = null;

   /**
    * @private
    * @type {AccessibilitySettingsEvent | null}
    */
   static #accessibilitySettingsEvent = null;

   /**
    * @private
    * @type {UserEvent | null}
    */
   static #userEvent = null;

   static get getMessageEvent() {
      return EventFactory.#messageEvent;
   }

   static get getAccessibilitySettingsEvent() {
      return EventFactory.#accessibilitySettingsEvent;
   }

   static get getUserEvent() {
      return EventFactory.#userEvent;
   }

   /**
    * @param {(param: MessageEvent) => void} value
    */
   static set setMessageEvent(value) {
      EventFactory.#messageEvent = value;
   }

   /**
    * @param {(param: AccessibilitySettingsEvent) => void} value
    */
   static set setAccessibilitySettingsEvent(value) {
      EventFactory.#accessibilitySettingsEvent = value;
   }

   /**
    * @param {(param: UserEvent) => void} value
    */
   static set setUserEvent(value) {
      EventFactory.#userEvent = value;
   }
}

module.exports = EventFactory;
