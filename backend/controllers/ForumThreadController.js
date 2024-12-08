const ForumThread = require("../models/ForumThread")
const ForumThreadService = require("../services/ForumThreadService")
class ForumThreadController {
    
    constructor(){
        this.forumThreadService = new ForumThreadService(ForumThread);
        this.getAllForumThreads = this.getAllForumThreads.bind(this);
        this.getForumThreadById = this.getForumThreadById.bind(this);
    }
    //Get all ForumThreads
    static async getAllForumThreads(request, response) {
        try {
            const forumThreads = await this.forumThreadService.getDocument();
            response.json(forumThreads);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumThread
    static async getForumThreadById(request, response) {
        try {
            const forumThreadId = request.params.id;
            const forumThread = await this.forumThreadService.getDocument(forumThreadId);
            response.json(forumThread);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumThreadController;