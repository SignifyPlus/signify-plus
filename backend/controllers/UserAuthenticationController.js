const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const ModelConstants = require('../constants/modelConstants.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class UserAuthenticationController {
   constructor() {}

   //Gets all UserAuthentication Records
   getAllUserAuthenticationRecords = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         response.json(forums);
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

   //creates a user authenticated record
   createUserAuthenticationRecord = async (request, response) => {
      const authenticationRecord =
         await this.createDefaultUserAuthenticationRecord(request.body.userId);
      if (authenticationRecord.exception) {
         return response
            .status(authenticationRecord.exception.status)
            .json(authenticationRecord.exception);
      }

      response.json(authenticationRecord.data);
   };

   //updates a user authenticated record
   updateUserAuthenticationRecord = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );

         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         response.json({ forum, forumMember });
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   async createDefaultUserAuthenticationRecord(userId) {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );

         LoggerFactory.getApplicationLogger.info(
            `Creating Default User Authentication record...`,
         );
         const userIdValidation = await ExceptionHelper.validate(
            userId,
            400,
            `userId is not provided.`,
         );
         if (userIdValidation) return new SignifyResult(null, userIdValidation);

         const defaultUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.saveDocument(
               { userId: userId },
               mongooseSession,
            );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(defaultUserAuthenticationRecord);
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
   }
}

module.exports = UserAuthenticationController;
