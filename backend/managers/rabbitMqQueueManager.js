const amqp = require('amqplib');
const CommonUtils = require('../utilities/commonUtils.js');
const LoggerFactory = require('../factories/loggerFactory.js');
class RabbitMQQueueManager {
   constructor(rabbitMqQueueURL) {
      this.rabbitMqQueueURL = rabbitMqQueueURL;
      this.rabbitMqConnection = null;
      this.rabbitMqChannel = null;
      this.establishConnection = this.establishConnection.bind(this);
   }

   async establishConnection() {
      try {
         this.rabbitMqConnection = await amqp.connect(this.rabbitMqQueueURL);
         this.rabbitMqChannel = await this.rabbitMqConnection.createChannel();
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(`Error: ${exception}`);
         throw new Error(`${exception}`);
      }
   }

   async disposeConnection() {
      try {
         if (this.rabbitMqChannel) {
            await this.rabbitMqChannel.close();
         }

         if (this.rabbitMqConnection) {
            await this.rabbitMqConnection.close();
         }
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(`Error: ${exception}`);
         throw new Error(`${exception}`);
      }
   }

   async queueMessage(queueName, contentType, bufferEncoding, stringifiedData) {
      try {
         //message survives when persistent is set to true
         //durable : true, queue survives upon crash/restart
         CommonUtils.waitForVariableToBecomeNonNull(
            this.getRabbitMqChannel.bind(this),
            1000,
         );
         await this.getRabbitMqChannel().assertQueue(queueName, {
            durable: true,
         });
         LoggerFactory.getApplicationLogger.info(
            `Buffered Data - ${Buffer.from(stringifiedData, 'utf-8')}`,
         );
         const sentToQueue = this.getRabbitMqChannel().sendToQueue(
            queueName,
            Buffer.from(stringifiedData, bufferEncoding),
            { persistent: true, contentType: contentType },
         );
         LoggerFactory.getApplicationLogger.info(
            `Is Message Queued: ${sentToQueue}`,
         );
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(
            `Exception Occured: ${exception}`,
         );
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
