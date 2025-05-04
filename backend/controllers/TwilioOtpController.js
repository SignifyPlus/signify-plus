const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
const OtpDto = require('../dtos/OtpDto.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class TwilioOtpController {
   constructor() {}
   getOtp = async (request, response) => {
      try {
         const phoneNumber = request.params.phoneNumber;
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;
         LoggerFactory.getApplicationLogger.info(
            `Requesting OTP for the phoneNumber: ${phoneNumber}`,
         );
         const signifyOtp = await ManagerFactory.getTwilioManager(4)
            .getTwilioClient.verify.v2.services(
               ManagerFactory.getTwilioManager().getTwilioVerifyServiceDto
                  .serviceSid,
            )
            .verifications.create({
               channel: ControllerConstants.TWILIO_VERIFY_CHANNEL,
               to: phoneNumber,
            });
         LoggerFactory.getApplicationLogger.info(
            `OTP info: ${JSON.stringify({ valid: signifyOtp.valid, status: signifyOtp.status })}`,
         );
         response.json({ valid: signifyOtp.valid, status: signifyOtp.status });
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   verifyOtp = async (request, response) => {
      try {
         const otpDto = new OtpDto(
            request.body?.phoneNumber,
            request.body?.otpCode,
         );
         const otpCodeValidation = await ExceptionHelper.validate(
            otpDto.otpCode,
            400,
            `otpCode from the body is missing.`,
            response,
         );
         if (otpCodeValidation) return otpCodeValidation;
         const phoneNumberValidation = await ExceptionHelper.validate(
            otpDto.phoneNumber,
            400,
            `phoneNumber from the body is missing.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: otpDto.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;
         LoggerFactory.getApplicationLogger.info(
            `OtpDto : ${JSON.stringify(otpDto)}`,
         );
         const verifyOtpCode = await ManagerFactory.getTwilioManager()
            .getTwilioClient.verify.v2.services(
               ManagerFactory.getTwilioManager().getTwilioVerifyServiceDto
                  .serviceSid,
            )
            .verificationChecks.create({
               code: otpDto.otpCode,
               to: otpDto.phoneNumber,
            });
         LoggerFactory.getApplicationLogger.info(
            `OTP status: ${JSON.stringify({ valid: verifyOtpCode.valid, status: verifyOtpCode.status })}`,
         );
         if (!verifyOtpCode.valid) {
            const signifyException = new SignifyException(
               400,
               `Invalid OTP code - twilio status: ${verifyOtpCode.status}.`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }

         //since the user is verified - we need to update the user authentication record
         EventDispatcher.dispatchEvent(
            EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
            { userId: user._id.toString(), isVerified: verifyOtpCode.valid },
         );

         response.json({
            valid: verifyOtpCode.valid,
            status: verifyOtpCode.status,
         });
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = TwilioOtpController;
