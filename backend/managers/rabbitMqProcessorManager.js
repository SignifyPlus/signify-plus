const RabbitMqMessageProcessor = require("../processors/rabbitMqMessageProcessor.js");
const EventConstants = require("../constants/eventConstants.js");
const RabbitMqConstants = require("../constants/rabbitMqConstants.js");
class RabbitMqProcessorManager {
    constructor() {
        //should tackle the initalization for all rabbitMQProcessors
        this.rabbitMqMessageProcessor  = new RabbitMqMessageProcessor();
        this.executeMessageProcessor = this.executeMessageProcessor.bind(this);
    }

    //call the processors - no matter how many there are - to start listening for new messages on their respective queues
    async executeMessageProcessor(rabbitMqChannel) {
        await this.rabbitMqMessageProcessor.executeMessageProcessor(rabbitMqChannel, EventConstants.MESSAGE_INGEST_EVENT, RabbitMqConstants.MESSAGES_QUEUE);
    }
}

module.exports = RabbitMqProcessorManager;
