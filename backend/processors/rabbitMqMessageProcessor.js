const EventDispatcher = require('../events/eventDispatcher.js');
const LoggerFactory = require('../factories/loggerFactory.js');
class RabbitMqMessageProcessor {
   constructor() {
      this.executeMessageProcessor = this.executeMessageProcessor.bind(this);
      this.haltConsumer = this.haltConsumer.bind(this);
   }
   async executeMessageProcessor(
      rabbitMqChannel,
      messageDispatchEventName,
      queueName,
   ) {
      var consumerTag;
      try {
         await rabbitMqChannel.assertQueue(queueName, { durable: true });
         consumerTag = rabbitMqChannel.consume(
            queueName,
            (message) => {
               if (message) {
                  rabbitMqChannel.ack(message);
                  const parsedMessage = JSON.parse(message.content.toString());
                  LoggerFactory.getApplicationLogger.info(`${parsedMessage}`);
                  //should be good now
                  EventDispatcher.dispatchEvent(
                     messageDispatchEventName,
                     parsedMessage,
                  );
               }
            },
            { noAck: false },
         );
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(
            `Exception Occured: ${exception}`,
         );
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
