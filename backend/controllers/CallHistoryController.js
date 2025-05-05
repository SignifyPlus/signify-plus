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

   getCallHistoryLogsByPhoneNumber = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const mainUser =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.params.phoneNumber,
            });
         const initiatorValidation = await ExceptionHelper.validate(
            mainUser,
            400,
            `User doesnt Exist in the user table!`,
            response,
         );
         if (initiatorValidation) return initiatorValidation;
         const callHistoryLogs =
            ServiceFactory.getCallHistoryService.getDocumentsByCustomFiltersQuery(
               { initiatorId: mainUser._id },
               mongooseSession,
            );
         const finalCallHistoryLogs = await callHistoryLogs
            .populate({
               path: 'initiatorId allParticipantsId',
               select: 'phoneNumber name',
            })
            .lean();
         response.json(finalCallHistoryLogs);
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

   logCallRecord = async (callLogDto) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         console.log(callLogDto);
         const callInitiatorValidation = await ExceptionHelper.validate(
            callLogDto.callinitiator,
            400,
            `callIniator is required!`,
         );
         if (callInitiatorValidation) {
            return new SignifyResult(null, callInitiatorValidation.exception);
         }
         const participantsValidation = await ExceptionHelper.validate(
            callLogDto.participants,
            400,
            `participants array is required! - it's an array [+902313124, +9014214125]`,
         );
         if (participantsValidation) {
            return new SignifyResult(null, participantsValidation.exception);
         }

         //database validations
         const participants =
            await ServiceFactory.getUserService.getDocumentsByCustomFilters({
               phoneNumber: { $in: callLogDto.participants },
            });

         if (participants.length != callLogDto.participants.length) {
            console.log('Failed!');
            const signifyException = new SignifyException(
               400,
               `Not all phoneNumbers are registered to the User table!`,
            );
            return new SignifyResult(null, signifyException.exception);
         }

         const participantsIds = participants.map(
            (participant) => participant._id,
         );
         const mainUser = participants.filter(
            (participant) =>
               participant.phoneNumber == callLogDto.callinitiator,
         );

         const callHistoryLog =
            await ServiceFactory.getCallHistoryService.saveDocument(
               {
                  initiatorId: mainUser[ControllerConstants.ZERO_INDEX]._id,
                  allParticipantsId: participantsIds,
                  callType: await this.#getCallType(callLogDto.isVoiceCall),
                  callDurationInSeconds: callLogDto?.totalDurationInSeconds,
                  initiatedAt: callLogDto?.BeginDateTime,
                  callStatus: callLogDto?.status,
               },
               mongooseSession,
            );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(callHistoryLog);
      } catch (exception) {
         console.log(exception);
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return new SignifyResult(null, signifyException);
      }
   };

   createCallHistoryRecord = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );

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

   async #getCallType(callType) {
      return callType?.isVoiceCall
         ? ControllerConstants.VOICE
         : ControllerConstants.VIDEO;
   }
}

module.exports = CallHistoryController;
