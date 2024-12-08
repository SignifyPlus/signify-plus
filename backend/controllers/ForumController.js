const Forum = require("../models/Forum")
const ForumService = require("../services/ForumService")
class ForumController {
    
    //Get all Forums
    static async getAllForums(request, response) {
        try {
            const forums = await ForumService.getDocument();
            response.json(forums);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Forum
    static async getForumById(request, response) {
        try {
            const forumId = request.params.id;
            const forum = await ForumService.getDocument(forumId);
            response.json(forum);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumController;