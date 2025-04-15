const ServiceFactory = require('../factories/serviceFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const SignifyResult = require('../dtos/SignifyResult.js');
class SettingsController {
   constructor() {}

   //Get single Settings
   getSettingsById = async (request, response) => {
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const settingsIdValidation = await ExceptionHelper.validate(
            request.params.id,
            400,
            `settingsId is not provided.`,
         );
         if (settingsIdValidation)
            return new SignifyResult(null, userIdValidation);

         const settingsId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Get settings by the id: ${settingsId}!`,
         );
         const settings =
            await ServiceFactory.getSettingsService.getDocumentById(
               settingsId,
               mongooseSession,
            );
         response.json(settings);
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

   //get Settings by Phone Number
   getSettingsByPhoneNumber = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const phoneNumberValidation = await ExceptionHelper.validate(
            request.params.phoneNumber,
            400,
            `phoneNumber is not provided.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const userPhoneNumber = request.params.phoneNumber;
         LoggerFactory.getApplicationLogger.info(
            `Getting settings by the phoneNumber: ${userPhoneNumber}!`,
         );
         const userObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.params.phoneNumber,
            });

         const userObjectValidation = await ExceptionHelper.validate(
            userObject,
            400,
            `No such exists with the phoneNumber: ${userPhoneNumber}`,
            response,
         );
         if (userObjectValidation) return userObjectValidation;

         //since we are using find in the service, it always returns a moongose query which resolves into an array of mongoose documents, so never null!!
         //and we can safely use populate on it
         const settingsQuery =
            ServiceFactory.getSettingsService.getDocumentsByCustomFiltersQuery(
               { userId: userObject._id.toString() },
               mongooseSession,
            );

         const settingsData = await settingsQuery.populate({
            path: 'userId',
            select: 'name phoneNumber',
         });
         response.json(settingsData);
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

   //create default accessibility settings
   createDefaultAccessibilitySettings = async (request, response) => {
      const defaultAccessibilitySettings = await this.createSettings(
         request.body.userId,
      );
      if (defaultAccessibilitySettings.exception) {
         return response
            .status(defaultAccessibilitySettings.exception.status)
            .json(defaultAccessibilitySettings.exception);
      }

      response.json(defaultAccessibilitySettings.data);
   };

   updateAccessibilitySettings = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         response.json(settingsData);
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
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

   async createSettings(userId) {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(
            `Creating accessibility settings...`,
         );
         const userIdValidation = await ExceptionHelper.validate(
            userId,
            400,
            `userId is not provided.`,
         );
         if (userIdValidation) return new SignifyResult(null, userIdValidation);

         const defaultAccessibilitySettings =
            await ServiceFactory.getSettingsService.saveDocument(
               { userId: userId },
               mongooseSession,
            );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         return new SignifyResult(defaultAccessibilitySettings);
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

module.exports = SettingsController;
