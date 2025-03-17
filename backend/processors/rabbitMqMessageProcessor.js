const EventFactory = require("../factories/eventFactory.js");
const CommonUtils = require("../utilities/commonUtils.js");
class RabbitMqMessageProcessor{
    constructor() {
        this.executeMessageProcessor = this.executeMessageProcessor.bind(this);
        this.haltConsumer = this.haltConsumer.bind(this);
    }
    async executeMessageProcessor(rabbitMqChannel, messageDispatchEventName, queueName) {
        var consumerTag;
        try {
            await rabbitMqChannel.assertQueue(queueName, {durable: true});
            consumerTag = rabbitMqChannel.consume(queueName, (message) => {
                    if (message) {
                        rabbitMqChannel.ack(message);
                        console.log(message.content.toString());
                        const parsedMessage = JSON.parse(message.content.toString());
                        //should be good now
                        EventFactory.getEventDispatcher.dispatchEvent(messageDispatchEventName, parsedMessage);
                    }
                }, {noAck: false});

        }catch(exception) {
            console.log(`Exception Occured: ${exception}`);
            await this.haltConsumer(rabbitMqChannel, consumerTag);
            throw new Error(`${exception}`);
        }
    }

    async haltConsumer(rabbitMqChannel, consumerTag) {
        if (consumerTag == null) {
            throw new Error(`Tried to close a consumer tag which is null!`);
        }
        await rabbitMqChannel.cancel(consumerTag);
    }
}

module.exports = RabbitMqMessageProcessor;