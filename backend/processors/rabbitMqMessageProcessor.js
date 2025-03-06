const ControllerFactory = require("../factories/controllerFactory.js");
const ManagerFactory = require("../factories/managerFactory.js");
class RabbitMqMessageProcessor{
    #dequeuedMessages = []
    constructor() {}
    async messageProcessor(queueName) {
        var consumerTag;
        try {
            await ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel().assertQueue(queueName, {durable: true});
            consumerTag = ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel().consume(queueName, (message) => {
                    if (message) {
                        ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel().ack(message);
                        this.#dequeuedMessages.push(JSON.parse(message.content.toString()));
                    }
                }, {noAck: false});

        }catch(exception) {
            console.log(`Exception Occured: ${exception}`);
            await this.haltConsumer(consumerTag);
            throw new Error(`${exception}`);
        }
    }

    async haltConsumer(consumerTag) {
        if (consumerTag == null) {
            throw new Error(`Tried to close a consumer tag which is null!`);
        }
        await ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel().cancel(consumerTag);
    }
}

module.exports = RabbitMqMessageProcessor;