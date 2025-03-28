
/**
 * ManagerFactory takes on the responsibility of initializing and providing instances 
 * of all the managers that are to be utilized throughout the application's runtime.
 */

const RabbitMqProcessorManager = require("../managers/rabbitMqProcessorManager.js");
const RabbitMqQueueManager = require("../managers/rabbitMqQueueManager.js");
const FirebaseManager = require("../managers/firebase/firebaseManager.js");

class ManagerFactory {
    //private fields
     /**
     * @private
     * @type {RabbitMqQueueManager | null}
     */
    static #rabbitMqQueueManager = null;

     /**
     * @private
     * @type {RabbitMqProcessorManager | null}
     */
    static #rabbitMqProcessorManager = null;

    /**
     * @private
     * @type {FirebaseManager | null}
     */
    static #fireBaseManager = null;

    static getRabbitMqQueueManager() {
        if (!ManagerFactory.#rabbitMqQueueManager) {
            ManagerFactory.#rabbitMqQueueManager = new RabbitMqQueueManager(process.env.CLOUD_AMQP_RABBIT_MQ_HOST_URL);
        }
        return ManagerFactory.#rabbitMqQueueManager;
    }

    static getRabbitMqProcessorManager() {
        if (!ManagerFactory.#rabbitMqProcessorManager) {
            ManagerFactory.#rabbitMqProcessorManager = new RabbitMqProcessorManager(ManagerFactory.getRabbitMqQueueManager());
        }
        return ManagerFactory.#rabbitMqProcessorManager;
    }

    static getFirebaseManager() {
        if (!ManagerFactory.#fireBaseManager) {
            ManagerFactory.#fireBaseManager = new FirebaseManager();
        }
        return ManagerFactory.#fireBaseManager;
    }
}

module.exports = ManagerFactory;