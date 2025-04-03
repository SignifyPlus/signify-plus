const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ModelConstants = require('../constants/modelConstants.js');
class ForumController {
   constructor() {}
   //Get all Forums
   getAllForums = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(`Retrieving all forums!`);
         const forums =
            await ServiceFactory.getForumService.getDocuments(moongooseSession);
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

   //Get a single forum by the id
   getForumById = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         const forumId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum by the id ${forumId}`,
         );
         const forum = await ServiceFactory.getForumService.getDocumentById(
            forumId,
            moongooseSession,
         );
         response.json(forum);
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

   //Get a single forum by the id
   getForumsByPhoneNumber = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         const phoneNumber = request.params.phoneNumber;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forums by the phone number ${phoneNumber}`,
         );

         const phoneNumberUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: phoneNumber,
            });
         const phoneNumberUserObjectValidation = await ExceptionHelper.validate(
            phoneNumberUserObject,
            400,
            `User with the phone number ${phoneNumber} doesnt exist in the user table!`,
            response,
         );
         if (phoneNumberUserObjectValidation)
            return phoneNumberUserObjectValidation;

         const forums =
            await ServiceFactory.getForumService.getDocumentsByCustomFilters(
               { createdBy: phoneNumberUserObject._id.toString() },
               moongooseSession,
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

   //create a forum
   createForum = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         //add validations here
         const forumNameValidation = await ExceptionHelper.validate(
            request.body.forumName,
            400,
            `forumName is not provided in the request body!`,
            response,
         );

         if (forumNameValidation) return forumNameValidation;
         const createdByValidation = await ExceptionHelper.validate(
            request.body.createdBy,
            400,
            `createdBy is not provided. Please add the phone number of the person who is trying to create the forum!`,
            response,
         );

         if (createdByValidation) return createdByValidation;

         //if exist in the database
         const createdByUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.createdBy,
            });
         const createdByUserObjectValidation = await ExceptionHelper.validate(
            createdByUserObject,
            400,
            `User with the phone number ${request.body.createdBy} doesnt exist in the user table!`,
            response,
         );
         if (createdByUserObjectValidation)
            return createdByUserObjectValidation;
         //TODO - please add that user to the forum member table as well!
         const forum = await ServiceFactory.getForumService.saveDocument(
            {
               forumName: request.body.forumName,
               forumDescription:
                  request.body.forumDescription == null ||
                  request.body.forumDescription == undefined
                     ? ModelConstants.FORUM_DEFAULT_DESCRIPTION
                     : request.body.forumDescription,
               createdBy: createdByUserObject._id.toString(),
            },
            moongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            moongooseSession,
         );
         response.json(forum);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            moongooseSession,
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
}

module.exports = ForumController;
