const ServiceFactory = require('../factories/serviceFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const Encrypt = require('../utilities/encrypt.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const SignifyException = require('../exception/SignifyException.js');
const ControllerConstants = require('../constants/controllerConstants.js');
const EventConstants = require('../constants/eventConstants.js');
const UpdateUserDto = require('../dtos/UpdateUserDto.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const ManagerFactory = require('../factories/managerFactory.js');
class CallHistoryController {
   constructor() {}

   getCallHistoryByUserId = async (request, response) => {
      try {
         const callHistoryByUserId = request.params.id;
         const callHistory =
            await ServiceFactory.getCallHistoryService.getDocumentById(
               callHistoryByUserId,
            );
         response.json(callHistory);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = CallHistoryController;
