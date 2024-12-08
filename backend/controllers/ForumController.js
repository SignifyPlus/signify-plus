const Forum = require("../models/Forum")
const ForumService = require("../services/ForumService")
class ForumController {
    
    constructor(){
        this.forumService = new ForumService(Forum);
        this.getAllForums = this.getAllForums.bind(this);
        this.getForumById = this.getForumById.bind(this);
    }
    //Get all Forums
    async getAllForums(request, response) {
        try {
            const forums = await this.forumService.getDocument();
            response.json(forums);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Forum
    async getForumById(request, response) {
        try {
            const forumId = request.params.id;
            const forum = await this.forumService.getDocument(forumId);
            response.json(forum);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumController;