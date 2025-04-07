const ServiceFactory = require('../factories/serviceFactory.js');
class CommentController {
   constructor() {}

   //Get all threads
   getAllComments = async (request, response) => {
      try {
         const comments = await ServiceFactory.getCommentService.getDocuments();
         response.json(comments);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = CommentController;
