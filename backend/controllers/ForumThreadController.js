const ForumThread = require("../models/ForumThread")
const ForumThreadService = require("../services/ForumThreadService")
class ForumThreadController {
    
    constructor(){
        this.forumThreadService = new ForumThreadService(ForumThread);
    }
    //Get all ForumThreads
    getAllForumThreads = async(request, response) => {
        try {
            const forumThreads = await this.forumThreadService.getDocuments();
            response.json(forumThreads);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumThread
    getForumThreadById = async(request, response) => {
        try {
            const forumThreadId = request.params.id;
            const forumThread = await this.forumThreadService.getDocumentById(forumThreadId);
            response.json(forumThread);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumThreadController;