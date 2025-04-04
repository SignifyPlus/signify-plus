const ServiceFactory = require('../factories/serviceFactory.js');
const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
class ForumMemberController {
   constructor() {}
   //Get all ForumMembers
   getAllForumMembers = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         LoggerFactory.getApplicationLogger.info(
            `Retrieving all forum members!`,
         );
         const forumMembers =
            await ServiceFactory.getForumMemberService.getDocuments(
               mongooseSession,
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

   //Get a single ForumMember by their userId
   getForumMemberByUserId = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const forumMemberId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum member by the user id ${forumMemberId}`,
         );
         const forumMember =
            await ServiceFactory.getForumMemberService.getDocumentByCustomFilters(
               { userId: forumMemberId },
               mongooseSession,
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
   //Get a single forum by the id
   getForumsByPhoneNumber = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
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
               mongooseSession,
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

   getForumMembersByForumId = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const forumId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum members by the forum id ${forumId}`,
         );
         const forumMember =
            await ServiceFactory.getForumMemberService.getDocumentsByCustomFilters(
               { forumId: forumId },
               mongooseSession,
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
