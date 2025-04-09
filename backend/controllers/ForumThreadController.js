const ServiceFactory = require('../factories/serviceFactory.js');
class ForumThreadController {
   constructor() {}

   //Get all ForumThreads
   getAllForumThreads = async (request, response) => {
      try {
         const forumThreads =
            await ServiceFactory.getForumThreadService.getDocuments();
         response.json(forumThreads);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single ForumThread
   getForumThreadById = async (request, response) => {
      try {
         const forumThreadId = request.params.id;
         const forumThread =
            await ServiceFactory.getForumThreadService.getDocumentById(
               forumThreadId,
            );
         response.json(forumThread);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ForumThreadController;
