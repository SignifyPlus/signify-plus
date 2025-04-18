const ServiceFactory = require('../factories/serviceFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const UpdateProfileDto = require('../dtos/UpdateProfileDto.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const EventConstants = require('../constants/eventConstants.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class SettingsController {
   constructor() {}

   //Get single Settings
   getSettingsById = async (request, response) => {
      var mongooseSession = null;
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
         response.json(await this.#updateEnumValue(settings));
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
            `No such user exists with the phoneNumber: ${userPhoneNumber}`,
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

         const settingsData = await settingsQuery
            .populate({
               path: 'userId',
               select: 'name phoneNumber',
            })
            .lean();
         response.json(await this.#preprocessSettingsData(settingsData));
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

   //continue working on this
   updateAccessibilitySettings = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );

         const phoneNumberValidation = await ExceptionHelper.validate(
            request.body.phoneNumber,
            400,
            `phoneNumber is not provided.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const userObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.phoneNumber,
            });

         const userObjectValidation = await ExceptionHelper.validate(
            userObject,
            400,
            `No such user exists with the phoneNumber: ${request.body.phoneNumber}`,
            response,
         );

         if (userObjectValidation) return userObjectValidation;

         const updateProfileData = new UpdateProfileDto(
            userObject._id.toString(),
            request.body?.theme,
            request.body?.autoDownload,
            request.body?.notificationEnabled,
            request.body?.aslTranslationLanguage,
            request.body?.profilePicture,
         );

         const existingAccessibilitySettingsObject =
            await ServiceFactory.getSettingsService.getDocumentByCustomFilters({
               userId: updateProfileData.userId,
            });

         const accessibilitySettingsObjectValidation =
            await ExceptionHelper.validate(
               existingAccessibilitySettingsObject,
               400,
               `No such accessibilitySettings record exists for the user: ${request.body.phoneNumber}`,
               response,
            );

         if (accessibilitySettingsObjectValidation)
            return accessibilitySettingsObjectValidation;

         const updatedAccessibilitySettings =
            await ServiceFactory.getSettingsService.updateDocument(
               {
                  userId: updateProfileData.userId,
               },
               {
                  theme:
                     updateProfileData.theme == null
                        ? existingAccessibilitySettingsObject.theme
                        : updateProfileData.theme,
                  autoDownload:
                     updateProfileData.autoDownload == null
                        ? existingAccessibilitySettingsObject.autoDownload
                        : updateProfileData.autoDownload,
                  notificationEnabled:
                     updateProfileData.notificationEnabled == null
                        ? existingAccessibilitySettingsObject.notificationEnabled
                        : updateProfileData.notificationEnabled,
                  aslTranslationLanguage:
                     updateProfileData.aslTranslationLanguage == null
                        ? existingAccessibilitySettingsObject.aslTranslationLanguage
                        : ControllerConstants
                             .ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE[
                             updateProfileData.aslTranslationLanguage
                          ],
                  notificationEnabled: updateProfileData.notificationEnabled,
                  updatedAt: Date.now(),
               },
               mongooseSession,
            );

         LoggerFactory.getApplicationLogger.info(
            `Dispatching an event to update the user's table for the userID : ${updateProfileData.userId}!`,
         );
         //the other controller will commit the final changes
         EventDispatcher.dispatchEvent(EventConstants.UPDATE_USER_EVENT, {
            id: userObject._id.toString(),
            profilePicture: updateProfileData.profilePicture,
            mongooseSession: mongooseSession,
         });
         response.json(updatedAccessibilitySettings);
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

   async #preprocessSettingsData(settingsData) {
      settingsData.forEach((data) => {
         this.#updateEnumValue(data);
      });
      return settingsData;
   }

   async #updateEnumValue(data) {
      data[ControllerConstants.ASL_TRANSLATION_LANGUAGE_KEY] =
         ControllerConstants.ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT[
            data[ControllerConstants.ASL_TRANSLATION_LANGUAGE_KEY]
         ];
      return data;
   }
}

module.exports = SettingsController;
