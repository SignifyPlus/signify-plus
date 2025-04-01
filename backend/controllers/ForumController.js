const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
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
            `Retrieving the forum by the id ${forumId}`,
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
         const forum = await ServiceFactory.getForumService.saveDocument(
            request.body,
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
