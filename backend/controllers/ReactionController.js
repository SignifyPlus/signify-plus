const ServiceFactory = require('../factories/serviceFactory.js');
class ReactionController {
   constructor() {}

   //Get all Reactions
   getAllReactions = async (request, response) => {
      try {
         const reactions =
            await ServiceFactory.getReactionService.getDocuments();
         response.json(reactions);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single Reaction
   getReactionById = async (request, response) => {
      try {
         const reactionId = request.params.id;
         const reaction =
            await ServiceFactory.getReactionService.getDocumentById(reactionId);
         response.json(reaction);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}
module.exports = ReactionController;
