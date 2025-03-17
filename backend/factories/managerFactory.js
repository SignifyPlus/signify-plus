
/**
 * ManagerFactory takes on the responsibility of initializing and providing instances 
 * of all the managers that are to be utilized throughout the application's runtime.
 */

const RabbitMqProcessorManager = require("../managers/rabbitMqProcessorManager.js");
const RabbitMqQueueManager = require("../managers/rabbitMqQueueManager.js");

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
}

module.exports = ManagerFactory;