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

   //create default accessibility settings
   createDefaultAccessibilitySettings = async (request, response) => {
      const defaultAccessibilitySettings =
         await this.#createDefaultAccessibilitySettings(request.body.userId);
      if (defaultAccessibilitySettings.exception) {
         return response
            .status(defaultAccessibilitySettings.exception.status)
            .json(defaultAccessibilitySettings.exception);
      }

      response.json(defaultAccessibilitySettings.data);
   };

   async #createDefaultAccessibilitySettings(userId) {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(
            `Creating accessibility settings!`,
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
