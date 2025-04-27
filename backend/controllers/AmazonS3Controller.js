const ManagerFactory = require('../factories/managerFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
const ControllerConstants = require('../constants/controllerConstants.js');
const AmazonS3RequestDto = require('../dtos/AmazonS3RequestDto.js');
const CommonUtils = require('../utilities/commonUtils.js');
const CommonConstants = require('../constants/commonConstants.js');
class AmazonS3Controller {
   constructor() {}
   getPresignedS3ProfilePicturebucketUrl = async (request, response) => {
      try {
         const amazonS3RequestDto = new AmazonS3RequestDto(
            request.body?.phoneNumber,
            request.body?.fileType,
         );

         const phoneNumberValidation = await ExceptionHelper.validate(
            amazonS3RequestDto.phoneNumber,
            400,
            `phoneNumber is missing from the request body`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const fileTypeValidation = await ExceptionHelper.validate(
            amazonS3RequestDto.fileType,
            400,
            `fileType is missing from the request body - for example if you are requesting a presigned url for a png upload, please specify image/png`,
            response,
         );
         if (fileTypeValidation) return fileTypeValidation;

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
            amazonS3RequestDto.fileType,
         );

         const fileNameValidation = await ExceptionHelper.validate(
            fileName,
            400,
            `Please ensure the content type/file type contains the accurate mime type!`,
            response,
         );
         if (fileNameValidation) return fileNameValidation;
         const presignedUrl =
            await ManagerFactory.getAwsS3Manager().generatePresignedS3ProfilePictureUploadUrl(
               fileName,
               amazonS3RequestDto.fileType,
            );

         response.json({ preSignedUrl: presignedUrl });
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   async #generateFileName(userObject, fileType) {
      const extension = CommonConstants.MIME_TYPE_TO_EXTENTION_MAP[fileType];
      if (extension == null || extension == undefined) {
         return null;
      }
      LoggerFactory.getApplicationLogger.info(
         `File extension retrieved: ${extension}`,
      );
      return (
         (await CommonUtils.generateUuid()) +
         '-' +
         userObject._id.toString() +
         extension
      );
   }
}

module.exports = AmazonS3Controller;
