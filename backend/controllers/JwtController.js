const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
const OtpDto = require('../dtos/OtpDto.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class JwtController {
   constructor() {}
   validateTokens = async (request, response) => {
      try {
         response.json({});
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
