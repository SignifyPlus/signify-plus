
/**
 * ControllerFactory takes on the responsibility of initializing and providing instances 
 * of all the controllers that are to be utilized throughout the application's runtime.
 */

//controllers
const ChatController = require("../controllers/ChatController.js");
const MessageController = require("../controllers/MessageController.js");
const UserController = require("../controllers/UserController.js");
const ContactController = require("../controllers/ContactController.js");
const UserActivityController = require("../controllers/UserActivityController.js");

class ControllerFactory {
    /**
     * @private
     * @type {UserController | null}
     */
        static #userController = null;
     /**
     * @private
     * @type {ChatController | null}
     */
     static #chatController = null;

    /**
     * @private
     * @type {MessageController | null}
     */
    static #messageController = null;

    /**
     * @private
     * @type {ContactController | null}
     */
        static #contactController = null;

    /**
     * @private
     * @type {UserActivityController | null}
     */
            static #userActivityController = null;
    constructor() {
    }

    static get getUserController() {
        if (!this.#userController) {
            this.#userController = new UserController();
        }
        return this.#userController;
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

    static get getContactController() {
        if (!this.#contactController) {
            this.#contactController = new ContactController();
        }
        return this.#contactController;
    }

    static get getUserActivitiyController() {
        if (!this.#userActivityController) {
            this.#userActivityController = new UserActivityController();
        }
        return this.#userActivityController;
    }
}

module.exports = ControllerFactory;