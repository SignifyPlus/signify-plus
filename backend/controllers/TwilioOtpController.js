const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class TwilioOtpController {
   constructor() {}
   getOtp = async (request, response) => {
      try {
         const phoneNumber = request.params.phoneNumber;
         LoggerFactory.getApplicationLogger.info(`Requesting OTP for the phoneNumber: ${phoneNumber}`);
         const signifyOtp = ManagerFactory.getTwilioManager().getTwilioClient.verify.v2
         .services(ManagerFactory.getTwilioManager().getTwilioVerifyServiceDto.serviceSid)
         .verifications.create({
            channel: ControllerConstants.TWILIO_VERIFY_CHANNEL,
            to: phoneNumber
         })
         LoggerFactory.getApplicationLogger.info(`OTP status: ${signifyOtp.status}`);
         json.reponse(signifyOtp);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   verifyOtp = async (request, response) => {
      try {
         json.reponse('');
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = TwilioOtpController;
