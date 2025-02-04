const Forum = require("../models/Forum")
const ForumService = require("../services/ForumService")
class ForumController {
    
    constructor(){
        this.forumService = new ForumService(Forum);
    }
    //Get all Forums
    getAllForums = async(request, response) => {
        try {
            const forums = await this.forumService.getDocumentsByCustomFilters();
            response.json(forums);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Forum
    getForumById = async(request, response) => {
        try {
            const forumId = request.params.id;
            const forum = await this.forumService.getDocumentById(forumId);
            response.json(forum);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumController;