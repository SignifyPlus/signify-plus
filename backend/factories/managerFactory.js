
/**
 * ManagerFactory takes on the responsibility of initializing and providing instances 
 * of all the managers that are to be utilized throughout the application's runtime.
 */

const RabbitMqQueueManager = require("../managers/rabbitMqQueueManager.js");

class ManagerFactory {
    //private fields
     /**
     * @private
     * @type {RabbitMqQueueManager | null}
     */
     static #rabbitMqQueueManager = null;

    constructor() {
    }

    static getRabbitMqQueueManager() {
        if (!this.#rabbitMqQueueManager) {
            this.#rabbitMqQueueManager = new RabbitMqQueueManager(process.env.CLOUD_AMQP_RABBIT_MQ_HOST_URL);
        }
        return this.#rabbitMqQueueManager;
    }
}

module.exports = ManagerFactory;