/**
 * ControllerFactory takes on the responsibility of initializing and providing instances
 * of all the controllers that are to be utilized throughout the application's runtime.
 */

//controllers
const ChatController = require('../controllers/ChatController.js');
const MessageController = require('../controllers/MessageController.js');
const UserController = require('../controllers/UserController.js');
const ContactController = require('../controllers/ContactController.js');
const UserActivityController = require('../controllers/UserActivityController.js');
const ForumController = require('../controllers/ForumController.js');
const ForumMember = require('../controllers/ForumMemberController.js');

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
    * @type {ForumController | null}
    */
   static #forumController = null;

   /**
    * @private
    * @type {ForumMember | null}
    */
   static #forumMember = null;

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
   constructor() {}

   static getUserController() {
      if (!ControllerFactory.#userController) {
         ControllerFactory.#userController = new UserController();
      }
      return ControllerFactory.#userController;
   }

   static getChatController() {
      if (!ControllerFactory.#chatController) {
         ControllerFactory.#chatController = new ChatController();
      }
      return ControllerFactory.#chatController;
   }

   static getMessageController() {
      if (!ControllerFactory.#messageController) {
         ControllerFactory.#messageController = new MessageController();
      }
      return ControllerFactory.#messageController;
   }

   static getContactController() {
      if (!ControllerFactory.#contactController) {
         ControllerFactory.#contactController = new ContactController();
      }
      return ControllerFactory.#contactController;
   }

   static getUserActivitiyController() {
      if (!ControllerFactory.#userActivityController) {
         ControllerFactory.#userActivityController =
            new UserActivityController();
      }
      return ControllerFactory.#userActivityController;
   }

   static getForumController() {
      if (!ControllerFactory.#forumController) {
         ControllerFactory.#forumController = new ForumController();
      }
      return ControllerFactory.#forumController;
   }

   static getForumMemberController() {
      if (!ControllerFactory.#forumMember) {
         ControllerFactory.#forumMember = new ForumMember();
      }
      return ControllerFactory.#forumMember;
   }
}

module.exports = ControllerFactory;
