/**
 * EventFactory takes on the responsibility of initializing and providing instances
 * of all the event classes that are to be utilized throughout the application's runtime.
 */

const AccessibilitySettingsEvent = require('../events/services/accessibilitySettingsEvent.js');
const CallLogEvent = require('../events/services/callLogEvent.js');
const ChatEvent = require('../events/services/chatEvent.js');
const MessageEvent = require('../events/services/messageEvent.js');
const UserAuthenticationEvent = require('../events/services/userAuthenticationEvent.js');
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
    * @type {ChatEvent | null}
    */
   static #chatEvent = null;

   /**
    * @private
    * @type {AccessibilitySettingsEvent | null}
    */
   static #accessibilitySettingsEvent = null;

   /**
    * @private
    * @type {UserAuthenticationEvent | null}
    */
   static #userAuthenticationEvent = null;

   /**
    * @private
    * @type {UserEvent | null}
    */
   static #userEvent = null;

   /**
    * @private
    * @type {CallLogEvent | null}
    */
   static #callLogEvent = null;

   static get getMessageEvent() {
      return EventFactory.#messageEvent;
   }

   static get getAccessibilitySettingsEvent() {
      return EventFactory.#accessibilitySettingsEvent;
   }

   static get getUserEvent() {
      return EventFactory.#userEvent;
   }

   static get getUserAuthenticationEvent() {
      return EventFactory.#userAuthenticationEvent;
   }

   static get getCallLogEvent() {
      return EventFactory.#callLogEvent;
   }

   static get getChatEvent() {
      return EventFactory.#chatEvent;
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

   /**
    * @param {(param: UserAuthenticationEvent) => void} value
    */
   static set setUserAuthenticationEvent(value) {
      EventFactory.#userAuthenticationEvent = value;
   }

   /**
    * @param {(param: CallLogEvent) => void} value
    */
   static set setCallLogEvent(value) {
      EventFactory.#callLogEvent = value;
   }

   /**
    * @param {(param: ChatEvent) => void} value
    */
   static set setChatEvet(value) {
      EventFactory.#chatEvent = value;
   }
}

module.exports = EventFactory;
