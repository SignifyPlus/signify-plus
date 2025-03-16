const RabbitMqMessageProcessor = require("../processors/rabbitMqMessageProcessor.js");
const EventConstants = require("../constants/eventConstants.js");
class RabbitMqProcessorManager {
    constructor() {
        //should tackle the initalization for all rabbitMQProcessors
        this.rabbitMqMessageProcessor  = new RabbitMqMessageProcessor();
    }

    //call the processors - no matter how many there are - to start listening for the new messages on their respective queues
    async ExecuteProcessors() {
        await this.rabbitMqMessageProcessor.executeMessageProcessor('', '');
    }
}

module.exports = RabbitMqProcessorManager;
