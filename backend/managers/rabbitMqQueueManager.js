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
            console.log(`Connection to RabbitMQ established!`);

            this.#rabbitMqChannel = await this.#rabbitMqConnection.createChannel();
            console.log(`Channel Created!`);
        }catch(exception){
            console.log(`Error: ${exception}`);
        }
    }

    async getRabbitMqConnection() {
        return this.#rabbitMqConnection
    }

    async getRabbitMqChannel() {
        return this.#rabbitMqChannel;
    }
}

module.exports = RabbitMQQueueManager;