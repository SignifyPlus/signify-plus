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
            `Retrieving all forum members data!`,
         );
         const forumMembersQuery =
            ServiceFactory.getForumMemberService.getDocumentsQuery(
               mongooseSession,
            );
         const forumMembersData = await forumMembersQuery.populate({
            path: 'forumId userId',
         });
         response.json(forumMembersData);
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
   getForumMemberRecordsByUserId = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const forumMemberId = request.params.id;
         LoggerFactory.getApplicationLogger.info(
            `Retrieving forum member records by the user id ${forumMemberId}`,
         );
         const forumMembersQuery =
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery(
               { userId: forumMemberId },
               mongooseSession,
            );
         const forumMembersData = await forumMembersQuery.populate({
            path: 'forumId userId',
         });
         response.json(forumMembersData);
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

   //Get forums by the user PhoneNumber
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
         const forumMembersQuery =
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery(
               { userId: phoneNumberUserObject._id.toString() },
               mongooseSession,
            );
         const forumMembersData = await forumMembersQuery.populate({
            path: 'forumId userId',
         });
         response.json(forumMembersData);
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
         const forumMembersQuery =
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery(
               { forumId: forumId },
               mongooseSession,
            );
         const forumMembersData = await forumMembersQuery.populate({
            path: 'forumId userId',
         });
         response.json(forumMembersData);
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

   createForumMember = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         //add validations here
         const forumIdValidation = await ExceptionHelper.validate(
            request.body.forumId,
            400,
            `forumId is not provided in the request body!`,
            response,
         );

         if (forumIdValidation) return forumIdValidation;
         const forumJoinee = await ExceptionHelper.validate(
            request.body.forumJoinee,
            400,
            `forumJoinee is not provided. Please add the forumJoinee's phoneNumber (the phone number of the person who is trying to join the forum)!`,
            response,
         );

         if (forumJoinee) return forumJoinee;

         //if exist in the database
         const createdByUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.forumJoinee,
            });
         const createdByUserObjectValidation = await ExceptionHelper.validate(
            createdByUserObject,
            400,
            `User with the phone number ${request.body.forumJoinee} doesnt exist in the user table!`,
            response,
         );
         if (createdByUserObjectValidation)
            return createdByUserObjectValidation;

         const forumIdObject =
            await ServiceFactory.getForumService.getDocumentByCustomFilters({
               _id: request.body.forumId,
            });

         const forum = await ServiceFactory.getForumMemberService.saveDocument(
            {
               userId: createdByUserObject._id.toString(),
               forumId: forumIdObject._id.toString(),
               isOwner:
                  request.body.isOwner == null ||
                  request.body.isOwner == undefined
                     ? false
                     : request.body.isOwner,
            },
            mongooseSession,
         );
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         response.json(forum);
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

module.exports = ForumMemberController;
