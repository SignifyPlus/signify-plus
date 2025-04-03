const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
class ForumMemberController {
   constructor() {}
   //Get all ForumMembers
   getAllForumMembers = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(
            `Retrieving all forum members!`,
         );
         const forumMembers =
            await ServiceFactory.getForumMemberService.getDocuments(
               moongooseSession,
            );
         response.json(forumMembers);
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

   //Get single ForumMember by their userId
   getForumMemberByUserId = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         const forumMemberId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum member by the user id ${forumMemberId}`,
         );
         const forumMember =
            await ServiceFactory.getForumMemberService.getDocumentByCustomFilters(
               { userId: forumMemberId },
               moongooseSession,
            );
         response.json(forumMember);
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

   //TODO
   //Get single ForumMember by their phoneNumber
   getForumMemberByPhoneNumber = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
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

   getForumMembersByForumId = async (request, response) => {
      var moongooseSession = null;
      try {
         moongooseSession =
            await ServiceFactory.getMongooseService.getMoongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            moongooseSession,
         );
         const forumId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum members by the forum id ${forumId}`,
         );
         const forumMember =
            await ServiceFactory.getForumMemberService.getDocumentsByCustomFilters(
               { forumId: forumId },
               moongooseSession,
            );
         response.json(forumMember);
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
}

module.exports = ForumMemberController;
