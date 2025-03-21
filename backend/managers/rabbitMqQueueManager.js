const amqp = require("amqplib");
const CommonUtils = require("../utilities/commonUtils.js");
class RabbitMQQueueManager {
    constructor(rabbitMqQueueURL) {
        this.rabbitMqQueueURL = rabbitMqQueueURL;
        this.rabbitMqConnection = null;
        this.rabbitMqChannel = null;
        this.establishConnection = this.establishConnection.bind(this);
    }

    async establishConnection() {
        try{
            this.rabbitMqConnection = await amqp.connect(this.rabbitMqQueueURL);
            this.rabbitMqChannel = await this.rabbitMqConnection.createChannel();
        }catch(exception){
            console.log(`Error: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    async disposeConnection () {
        try {
            if (this.rabbitMqChannel) {
                await this.rabbitMqChannel.close();
            }

            if (this.rabbitMqConnection) {
                await this.rabbitMqConnection.close();
            }

        }catch(exception) {
            console.log(`Error: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    async queueMessage(queueName, contentType, bufferEncoding, stringifiedData) {
        try {
            //message survives when persistent is set to true
            //durable : true, queue survives upon crash/restart
            CommonUtils.waitForVariableToBecomeNonNull(this.getRabbitMqChannel.bind(this), 1000)
            await this.getRabbitMqChannel().assertQueue(queueName, {durable: true});
            console.log(`Stringified Data: ${stringifiedData}`);
            console.log(`Buffered Data - ${Buffer.from(stringifiedData, 'utf-8')}`);
            const sentToQueue = this.getRabbitMqChannel().sendToQueue(queueName, Buffer.from(stringifiedData, bufferEncoding), {persistent: true, contentType: contentType});
            console.log(`Is Message Queued: ${sentToQueue}`);
        }catch(exception) {
            console.log(`Exception Occured: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    getRabbitMqConnection() {
        return this.rabbitMqConnection;
    }

    getRabbitMqChannel() {
        return this.rabbitMqChannel;
    }
}

module.exports = RabbitMQQueueManager;