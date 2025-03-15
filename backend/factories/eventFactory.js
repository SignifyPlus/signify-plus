
/**
 * EventFactory takes on the responsibility of initializing and providing instances 
 * of all the event classes that are to be utilized throughout the application's runtime.
 */

//controllers
const EventDispatcher = require("../events/eventDispatcher.js");
const MessageEvent = require("../events/services/messageEvent.js");

class EventFactory {
    //private fields
     /**
     * @private
     * @type {EventDispatcher | null}
     */
     static #eventDispatcher = null;

    /**
     * @private
     * @type {MessageEvent | null}
     */
      static #messageEvent = null;

    constructor() {
    }

    static get getEventDispatcher() {
        return this.#eventDispatcher;
    }
    
    /**
     * @param {(param: EventDispatcher) => void} value
     */
    static set setEventDispatcher(value) {
        this.#eventDispatcher = value;
    }

    static get getMessageEvent() {
        return this.#messageEvent;
    }
        
    /**
     * @param {(param: MessageEvent) => void} value
     */
    static set setMessageEvent(value) {
        this.#messageEvent = value;
    }
}

module.exports = EventFactory;