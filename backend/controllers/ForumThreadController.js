const ForumThread = require("../models/ForumThread")
const ForumThreadService = require("../services/ForumThreadService")
class ForumThreadController {
    
    //Get all ForumThreads
    static async getAllForumThreads(request, response) {
        try {
            const forumThreads = await ForumThreadService.getDocument();
            response.json(forumThreads);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumThread
    static async getForumThreadById(request, response) {
        try {
            const forumThreadId = request.params.id;
            const forumThread = await ForumThreadService.getDocument(forumThreadId);
            response.json(forumThread);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumThreadController;