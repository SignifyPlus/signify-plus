
/**
 * EventFactory takes on the responsibility of initializing and providing instances 
 * of all the event classes that are to be utilized throughout the application's runtime.
 */

//controllers
const EventDispatcher = require("../events/eventDispatcher.js");

class EventFactory {
    //private fields
     /**
     * @private
     * @type {EventDispatcher | null}
     */
     static #eventDispatcher = null;

    constructor() {
    }

    static get getEventDispatcher() {
        if (!this.#eventDispatcher) {
            this.#eventDispatcher = new EventDispatcher();
        }
        return this.#eventDispatcher;
    }
}

module.exports = EventFactory;