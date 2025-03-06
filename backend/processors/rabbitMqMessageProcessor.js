const ControllerFactory = require("../factories/controllerFactory.js");
const ManagerFactory = require("../factories/managerFactory.js");
class RabbitMqMessageProcessor{
    constructor() {}

    async consumeMessagesFromRabbitMqQueue(queueName) {
        for await (const message of ManagerFactory.getRabbitMqQueueManager().popMessages(queueName)) {
            //preprocess message and push
            
        }
    }
}

module.exports = RabbitMqMessageProcessor;