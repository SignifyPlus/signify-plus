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
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.params.phoneNumber,
            });
         const initiatorValidation = await ExceptionHelper.validate(
            user,
            400,
            `User doesnt Exist in the user table!`,
            response,
         );
         if (initiatorValidation) return initiatorValidation;
         const callHistoryLogs =
            ServiceFactory.getCallHistoryService.findLogsInOrderByCreatedAtQuery(
               {
                  $or: [
                     { initiatorId: user._id },
                     { participants: { $in: [user._id] } },
                  ],
               },
               1, //ascending order
               mongooseSession,
            );
         const finalCallHistoryLogs = await callHistoryLogs
            .populate({
               path: 'initiatorId participants',
               select: 'phoneNumber name profilePicture',
            })
            .lean();
         const preprocessedLogs =
            await this.#preprocessLogs(finalCallHistoryLogs);
         response.json(preprocessedLogs);
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

   deleteCallHistoryLogs = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const userPhoneNumberValidation = await ExceptionHelper.validate(
            request.body.phoneNumber,
            400,
            `phoneNumber is required!`,
            response,
         );
         if (userPhoneNumberValidation) return userPhoneNumberValidation;

         const callHistoryLogIdValidation = await ExceptionHelper.validate(
            request.body.callHistoryLogIds,
            400,
            `callHistoryLogIds array is not provided! - ['681800701e32d226922d24f0', '681800701e32d226922d24f1']`,
            response,
         );
         if (callHistoryLogIdValidation) return callHistoryLogIdValidation;

         if (!Array.isArray(request.body.callHistoryLogIds)) {
            const signifyException = new SignifyException(
               400,
               `callHistoryLogIds is not an array!!`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }

         // Get user by phone number
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `phoneNumber doesn't exist in the user table!`,
            response,
         );
         if (userValidation) return userValidation;

         const callHistoryLogs =
            await ServiceFactory.getCallHistoryService.getDocumentsByCustomFilters(
               {
                  _id: { $in: request.body.callHistoryLogIds },
                  $or: [
                     { initiatorId: user._id },
                     { participants: { $in: [user._id] } },
                  ],
               },
               mongooseSession,
            );

         //we can either throw this error, or silently remove the ones that are valid - for now, ill throw the error
         //revisit later if needed
         if (request.body.callHistoryLogIds.length != callHistoryLogs.length) {
            const signifyException = new SignifyException(
               400,
               `Not all callHistoryLogIds are valid - please remove the ones that dont exist!`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }

         const callHistoryLogIds = callHistoryLogs.filter((log) => log._id);
         const updatedCallHistoryLogs =
            await ServiceFactory.getCallHistoryService.updateDocuments(
               { _id: { $in: callHistoryLogIds } },
               { $addToSet: { deletedBy: user._id } },
            );
         response.json(updatedCallHistoryLogs);
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
                  participants: participantsIds,
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

   async #getCallType(callType) {
      return callType?.isVoiceCall
         ? ControllerConstants.VOICE
         : ControllerConstants.VIDEO;
   }

   //we dont store this info in the database, require another table to store more detailed responses
   //for now we'll preprocess, and send to the frontend (due to time constraints)
   async #preprocessLogs(callLogs) {
      for (var i = 0; i < callLogs.length; i++) {
         callLogs[i].participants.forEach((participant) => {
            participant.type =
               participant._id.toString() ==
               callLogs[i].initiatorId._id.toString()
                  ? ControllerConstants.OUTGOING
                  : ControllerConstants.INCOMING;
         });
      }
      return callLogs;
   }
}

module.exports = CallHistoryController;
