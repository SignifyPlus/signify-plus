const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
const OtpDto = require('../dtos/OtpDto.js');
const ControllerConstants = require('../constants/controllerConstants.js');
const JwtRequestDto = require('../dtos/JwtRequestDto.js');
class JwtController {
   constructor() {}
   validateTokens = async (request, response) => {
      try {
         const jwtRequestDto = new JwtRequestDto(
            request.body?.phoneNumber,
            request.body?.refreshToken,
         );
         const phoneNumberValidation = await ExceptionHelper.validate(
            jwtRequestDto.phoneNumber,
            400,
            `phoneNumber is required in the request body for validation`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const refreshTokenValidation = await ExceptionHelper.validate(
            jwtRequestDto.refreshToken,
            400,
            `refreshToken is required in the request body for validation`,
            response,
         );
         if (refreshTokenValidation) return refreshTokenValidation;

         //DB validations
         const userObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: jwtRequestDto.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            userObject,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;

         const result = await ManagerFactory.getJwtManager().verifyRefreshToken(
            jwtRequestDto.refreshToken,
         );
         if (result.exception) {
            const signifyException = new SignifyException(
               401,
               `Token expired or it is invalid - please provide a valid token, or login again to generate a new refresh token: ${result.exception.message}`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }
         response.json({ isValid: true, details: result.data });
      } catch (exception) {
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };
}

module.exports = JwtController;
