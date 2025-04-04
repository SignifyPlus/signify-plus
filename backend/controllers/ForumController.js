const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ModelConstants = require('../constants/modelConstants.js');
const ControllerConstants = require('../constants/controllerConstants.js');
class ForumController {
   constructor() {}
   //Get all Forums
   getAllForums = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(`Retrieving all forums!`);
         const forums =
            await ServiceFactory.getForumService.getDocuments(mongooseSession);
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
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const forumId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum by the id ${forumId}`,
         );
         const forum = await ServiceFactory.getForumService.getDocumentById(
            forumId,
            mongooseSession,
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

   //create a forum
   createForum = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
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

         const forum = await ServiceFactory.getForumService.saveDocument(
            {
               forumName: request.body.forumName,
               forumDescription:
                  request.body.forumDescription == null ||
                  request.body.forumDescription == undefined
                     ? ModelConstants.FORUM_DEFAULT_DESCRIPTION
                     : request.body.forumDescription,
            },
            mongooseSession,
         );
         const forumMember =
            await ServiceFactory.getForumMemberService.saveDocument(
               {
                  userId: createdByUserObject._id.toString(),
                  forumId: forum[ControllerConstants.ZERO_INDEX]._id.toString(),
                  isOwner: true,
               },
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
}

module.exports = ForumController;
