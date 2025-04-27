/**
 * ManagerFactory takes on the responsibility of initializing and providing instances
 * of all the managers that are to be utilized throughout the application's runtime.
 */

const RabbitMqProcessorManager = require('../managers/rabbitMqProcessorManager.js');
const RabbitMqQueueManager = require('../managers/rabbitMqQueueManager.js');
const FirebaseManager = require('../managers/firebase/firebaseManager.js');
const AwsS3Manager = require('../managers/Aws/awsS3Manager.js');
const TwilioManager = require('../managers/twilio/twilioManager.js');

class ManagerFactory {
   //private fields
   /**
    * @private
    * @type {RabbitMqQueueManager | null}
    */
   static #rabbitMqQueueManager = null;

   /**
    * @private
    * @type {RabbitMqProcessorManager | null}
    */
   static #rabbitMqProcessorManager = null;

   /**
    * @private
    * @type {FirebaseManager | null}
    */
   static #fireBaseManager = null;

   /**
    * @private
    * @type {AwsS3Manager | null}
    */
   static #awsS3Manager = null;

   /**
    * @private
    * @type {TwilioManager | null}
    */
   static #twilioManager = null;

   static getRabbitMqQueueManager() {
      if (!ManagerFactory.#rabbitMqQueueManager) {
         ManagerFactory.#rabbitMqQueueManager = new RabbitMqQueueManager(
            process.env.CLOUD_AMQP_RABBIT_MQ_HOST_URL,
         );
      }
      return ManagerFactory.#rabbitMqQueueManager;
   }

   static getRabbitMqProcessorManager() {
      if (!ManagerFactory.#rabbitMqProcessorManager) {
         ManagerFactory.#rabbitMqProcessorManager =
            new RabbitMqProcessorManager(
               ManagerFactory.getRabbitMqQueueManager(),
            );
      }
      return ManagerFactory.#rabbitMqProcessorManager;
   }

   static getFirebaseManager() {
      if (!ManagerFactory.#fireBaseManager) {
         ManagerFactory.#fireBaseManager = new FirebaseManager();
      }
      return ManagerFactory.#fireBaseManager;
   }

   static getAwsS3Manager() {
      if (!ManagerFactory.#awsS3Manager) {
         ManagerFactory.#awsS3Manager = new AwsS3Manager();
      }
      return ManagerFactory.#awsS3Manager;
   }

   static getTwilioManager() {
      if (!ManagerFactory.#twilioManager) {
         ManagerFactory.#twilioManager = new TwilioManager();
      }
      return ManagerFactory.#twilioManager;
   }
}

module.exports = ManagerFactory;
