const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const AmazonS3RequestDto = require('../dtos/AmazonS3RequestDto.js');
const CommonUtils = require('../utilities/commonUtils.js');
const CommonConstants = require('../constants/commonConstants.js');
const SignifyException = require('../exception/SignifyException.js');
class AmazonS3Controller {
   constructor() {}
   getPresignedS3ProfilePicturebucketUrl = async (request, response) => {
      try {
         const amazonS3RequestDto = new AmazonS3RequestDto(
            request.body?.phoneNumber,
            request.body?.extension,
         );

         const phoneNumberValidation = await ExceptionHelper.validate(
            amazonS3RequestDto.phoneNumber,
            400,
            `phoneNumber is missing from the request body`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const extensionValidation = await ExceptionHelper.validate(
            amazonS3RequestDto.extension,
            400,
            `extension is missing from the request body - for example if you are requesting a presigned url for a png upload, please specify .png. This is needed to create S3 bucket's header. File name will be automatically generated :)`,
            response,
         );
         if (extensionValidation) return extensionValidation;

         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;
         LoggerFactory.getApplicationLogger.info(
            `Generating presigned S3 bucket URl for the user: ${user._id.toString()}`,
         );
         const fileName = await this.#generateFileName(
            user,
            amazonS3RequestDto.extension,
         );

         const mimeType = await this.#generateMimeType(
            amazonS3RequestDto.extension,
         );
         const mimeTypeValidation = await ExceptionHelper.validate(
            mimeType,
            400,
            `Not a valid extension type. These are valid/supported extensions ${Object.keys(CommonConstants.EXTENSION_TO_MIME_TYPE_MAP).join(',')}`,
            response,
         );
         if (mimeTypeValidation) return mimeTypeValidation;

         const awsS3PresignedResponse =
            await ManagerFactory.getAwsS3Manager().generatePresignedS3ProfilePictureUploadUrl(
               fileName,
               mimeType,
            );

         response.json(awsS3PresignedResponse);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   async #generateMimeType(extension) {
      const mimeType = CommonConstants.EXTENSION_TO_MIME_TYPE_MAP[extension];
      if (mimeType == null || mimeType == undefined) {
         return null;
      }
      LoggerFactory.getApplicationLogger.info(
         `Mime type retrieved: ${extension}`,
      );
      return mimeType;
   }

   async #generateFileName(userObject, extension) {
      const fileName =
         (await CommonUtils.generateUuid()) +
         '-' +
         userObject._id.toString() +
         extension;
      LoggerFactory.getApplicationLogger.info(`File name created: ${fileName}`);
      return fileName;
   }
}

module.exports = AmazonS3Controller;
