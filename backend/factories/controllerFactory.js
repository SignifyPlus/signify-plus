
/**
 * ControllerFactory takes on the responsibility of initializing and providing instances 
 * of all the controllers that are to be utilized throughout the application's runtime.
 */

//controllers
const ChatController = require("../controllers/ChatController.js");

class ControllerFactory {
    //private fields
     /**
     * @private
     * @type {ChatController | null}
     */
     static #chatController = null;

    constructor() {
    }

    static get getChatController() {
        if (!this.#chatController) {
            this.#chatController = new ChatController();
        }
        return this.#chatController;
    }
}

module.exports = ControllerFactory;