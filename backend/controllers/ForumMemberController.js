const ServiceFactory = require('../factories/serviceFactory.js');
class ForumMemberController {
   constructor() {}
   //Get all ForumMembers
   getAllForumMembers = async (request, response) => {
      try {
         const forumMembers =
            await ServiceFactory.getForumMemberService.getDocuments();
         response.json(forumMembers);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single ForumMember
   getForumMemberById = async (request, response) => {
      try {
         const forumMemberId = request.params.id;
         const forumMember =
            await ServiceFactory.getForumMemberService.getDocumentById(
               forumMemberId,
            );
         response.json(forumMember);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ForumMemberController;
