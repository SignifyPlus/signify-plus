const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const UserAuthenticationDto = require('../dtos/UpdateUserAuthenticationDto.js');
class UserAuthenticationController {
   constructor() {}

   //Gets all UserAuthentication Records
   getUserAuthenticationRecord = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(
            `Fetching the user authentication record for the Phone Number ${request.params.phoneNumber}`,
         );
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
         const userAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters(
               {
                  userId: user._id.toString(),
               },
            );
         const userAuthenticationRecordValidation =
            await ExceptionHelper.validate(
               userAuthenticationRecord,
               400,
               `userAuthenticationRecord does not exist in the database - please try creating a new user to automatically create an entry. You might be using an old user account`,
               response,
            );
         if (userAuthenticationRecordValidation)
            return userAuthenticationRecordValidation;
         response.json(userAuthenticationRecord);
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

         const userAuthenticationDto = new UserAuthenticationDto(
            request.body?.phoneNumber,
            request.body?.isVerified,
            request.body?.refreshToken,
         );

         const phoneNumberValidation = await ExceptionHelper.validate(
            userAuthenticationDto.phoneNumber,
            400,
            `phoneNumber is not provided`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: userAuthenticationDto.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;

         LoggerFactory.getApplicationLogger.info(
            `Updating the userAuthentication record for the Phone Number ${userAuthenticationDto.phoneNumber}`,
         );

         const existingUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters(
               {
                  userId: user._id.toString(),
               },
            );
         const existingUserAuthenticationRecordValidation =
            await ExceptionHelper.validate(
               existingUserAuthenticationRecord,
               400,
               `userAuthentication entry does not exist in the database - please try creating a new user to automatically create a default entry. You might be using an old account`,
               response,
            );
         if (existingUserAuthenticationRecordValidation)
            return existingUserAuthenticationRecordValidation;
         const updatedUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.updateDocument(
               existingUserAuthenticationRecord._id,
               {
                  isVerified:
                     userAuthenticationDto.isVerified == null
                        ? existingUserAuthenticationRecord.isVerified
                        : userAuthenticationDto.isVerified,
                  refreshToken:
                     userAuthenticationDto.refreshToken == null
                        ? existingUserAuthenticationRecord.refreshToken
                        : userAuthenticationDto.refreshToken,
                  updatedAt: Date.now(),
               },
               mongooseSession,
            );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         response.json(updatedUserAuthenticationRecord);
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

   async updateUserAuthenticationViaEvent(data) {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         if (data.userId == null || data.userId == undefined) {
            const signifyException = new SignifyException(
               500,
               `userId is null`,
            );
            return new SignifyResult(null, signifyException);
         }
         LoggerFactory.getApplicationLogger.info(
            `Updating the userAuthentication record for the userId: ${data.userId}`,
         );

         const existingUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters(
               {
                  userId: data.userId,
               },
            );
         const existingUserAuthenticationRecordValidation =
            await ExceptionHelper.validate(
               existingUserAuthenticationRecord,
               400,
               `userAuthentication entry does not exist in the database - please try creating a new user to automatically create a default entry. You might be using an old account`,
            );
         if (existingUserAuthenticationRecordValidation)
            return new SignifyResult(null, userIdValidation);
         const updatedUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.updateDocument(
               existingUserAuthenticationRecord._id,
               {
                  isVerified:
                     data.isVerified == null
                        ? existingUserAuthenticationRecord.isVerified
                        : data.isVerified,
                  refreshToken:
                     data.refreshToken == null
                        ? existingUserAuthenticationRecord.refreshToken
                        : data.refreshToken,
                  updatedAt: Date.now(),
               },
               mongooseSession,
            );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(updatedUserAuthenticationRecord);
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

   async createDefaultUserAuthenticationRecord(userData) {
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
            userData?.userId,
            400,
            `userId is not provided.`,
         );
         if (userIdValidation) return new SignifyResult(null, userIdValidation);

         const defaultUserAuthenticationRecord =
            await ServiceFactory.getUserAuthenticationService.saveDocument(
               {
                  userId: userData.userId,
                  refreshToken: userData?.refreshToken,
               },
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
