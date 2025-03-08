
/**
 * ControllerFactory takes on the responsibility of initializing and providing instances 
 * of all the controllers that are to be utilized throughout the application's runtime.
 */

//controllers
const ChatController = require("../controllers/ChatController.js");
const MessageController = require("../controllers/MessageController.js");

class ControllerFactory {
    //private fields
     /**
     * @private
     * @type {ChatController | null}
     */
     static #chatController = null;

    /**
     * @private
     * @type {ChatController | null}
     */
    static #messageController = null;
    constructor() {
    }

    static get getChatController() {
        if (!this.#chatController) {
            this.#chatController = new ChatController();
        }
        return this.#chatController;
    }

    static get getMessageController() {
        if (!this.#messageController) {
            this.#messageController = new MessageController();
        }
        return this.#messageController;
    }
}

module.exports = ControllerFactory;