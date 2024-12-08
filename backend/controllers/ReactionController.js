const Reaction = require("../models/Reaction")
const ReactionService = require("../services/ReactionService")
class ReactionController {
    
    //Get all Reactions
    static async getAllReactions(request, response) {
        try {
            const reactions = await ReactionService.getDocument();
            response.json(reactions);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Reaction
    static async getReactionById(request, response) {
        try {
            const reactionId = request.params.id;
            const reaction = await ReactionService.getDocument(reactionId);
            response.json(reaction);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}
module.exports = ReactionController;