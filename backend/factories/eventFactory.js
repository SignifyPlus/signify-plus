
/**
 * EventFactory takes on the responsibility of initializing and providing instances 
 * of all the event classes that are to be utilized throughout the application's runtime.
 */

//controllers
const MessageEvent = require("../events/services/messageEvent.js");

class EventFactory {
    //private fields
    /**
     * @private
     * @type {MessageEvent | null}
     */
      static #messageEvent = null;

    static get getMessageEvent() {
        return EventFactory.#messageEvent;
    }
        
    /**
     * @param {(param: MessageEvent) => void} value
     */
    static set setMessageEvent(value) {
        EventFactory.#messageEvent = value;
    }
}

module.exports = EventFactory;