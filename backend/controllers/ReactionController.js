const Reaction = require("../models/Reaction")
const ReactionService = require("../services/ReactionService")
class ReactionController {

    constructor(){
        this.reactionService = new ReactionService(Reaction);
    }
    //Get all Reactions
    getAllReactions = async(request, response) => {
        try {
            const reactions = await this.reactionService.getDocument();
            response.json(reactions);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Reaction
    getReactionById = async(request, response) =>{
        try {
            const reactionId = request.params.id;
            const reaction = await this.reactionService.getDocument(reactionId);
            response.json(reaction);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}
module.exports = ReactionController;