const LoggerFactory = require('../../factories/loggerFactory.js');
const Twilio = require('twilio');
const TwilioVerifyServiceDto = require('../twilio/models/TwilioVerifyService.js');
class TwilioManager {
   /**
    * @type {Twilio.Twilio | Null}
    */
   #twilioClient = null;

   /**
    * @type {TwilioVerifyServiceDto | Null}
    */
   #twilioVerifyServiceDto = null;
   constructor() {}

   async initializeTwilioClient(twilioAdminDto) {
      LoggerFactory.getApplicationLogger.info(`Initializing Twilio Client...`);
      this.#twilioClient = Twilio(
         await twilioAdminDto.getDecryptedAccountSid(),
         await twilioAdminDto.getDecryptedAuthToken(),
      );
   }

   async setTwilioVerifyServiceDto(serviceId) {
      this.#twilioVerifyServiceDto = new TwilioVerifyServiceDto(serviceId);
   }

   get getTwilioVerifyServiceDto() {
      return this.#twilioVerifyServiceDto;
   }

   get getTwilioClient() {
      return this.#twilioClient;
   }
}

module.exports = TwilioManager;
