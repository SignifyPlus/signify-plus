const amqp = require("amqplib");
class RabbitMQQueueManager {
    #rabbitMqConnection = null;
    #rabbitMqChannel = null;
    constructor(rabbitMqQueueURL) {
        this.rabbitMqQueueURL = rabbitMqQueueURL;
        this.#rabbitMqConnection = null;
        this.#rabbitMqChannel = null;
    }

    async establishConnection() {
        try{
            this.#rabbitMqConnection = await amqp.connect(this.rabbitMqQueueURL);
            this.#rabbitMqChannel = await this.#rabbitMqConnection.createChannel();
        }catch(exception){
            console.log(`Error: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    async disposeConnection () {
        try {
            if (this.#rabbitMqChannel) {
                await this.#rabbitMqChannel.close();
            }

            if (this.#rabbitMqConnection) {
                await this.#rabbitMqConnection.close();
            }

        }catch(exception) {
            console.log(`Error: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    async queueMessage(queueName, message) {
        try {
            //message survives when persistent is set to true
            //durable : true, queue survives upon crash/restart
            await this.#rabbitMqChannel.assertQueue(queueName, {durable: true});
            this.#rabbitMqChannel.sendToQueue(queueName, Buffer.from(message), {persistent: true});
            console.log(`Message has been queued!`);
        }catch(exception) {
            console.log(`Exception Occured: ${exception}`);
            throw new Error(`${exception}`);
        }
    }

    //generator which fields the result continuosly - indefinitely runs
    async *popMessages(queueName) {
        var consumerTag;
        try {
            await this.#rabbitMqChannel.assertQueue(queueName, {durable: true});
            consumerTag = await this.#rabbitMqChannel.consume(queueName, (message) => {
                    if (message) {
                        //sends acknowledgement that its ready to be consumed - hence dequeues it entirely from the queue
                        this.#rabbitMqChannel.ack(message);
                        yield JSON.parse(message.content.toString());
                    }
                });
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
        await this.#rabbitMqChannel.cancel(consumerTag);
    }

    async getRabbitMqConnection() {
        return this.#rabbitMqConnection
    }

    async getRabbitMqChannel() {
        return this.#rabbitMqChannel;
    }
}

module.exports = RabbitMQQueueManager;