const LoggerFactory = require('../../factories/loggerFactory.js');
const CommonUtils = require('../../utilities/commonUtils.js');
const Twilio = require('twilio');
class TwilioManager {
   #twilioClient = null;
   constructor() {}

   async initializeTwilioClient(twilioAdminDto) {
      LoggerFactory.getApplicationLogger.info(`Initializing Twilio Client...`);
      this.#twilioClient = Twilio(
         await twilioAdminDto.getDecryptedAccountSid(),
         await twilioAdminDto.getDecryptedAuthToken(),
      );
   }

   async getTwilioVerifyServiceDto() {
      return;
   }

   get getTwilioClient() {
      return this.#twilioClient;
   }
}

module.exports = TwilioManager;
