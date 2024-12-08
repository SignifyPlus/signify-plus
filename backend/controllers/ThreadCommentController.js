const ThreadComment = require("../models/ThreadComment")
const ThreadCommentService = require("../services/ThreadCommentService")
class ThreadCommentController {
    
    constructor(){
        this.threadCommentService = new ThreadCommentService(ThreadComment);
        this.getAllThreadComments = this.getAllThreadComments.bind(this);
        this.getThreadCommentById = this.getThreadCommentById.bind(this);
    }
    //Get all ThreadComments
    async getAllThreadComments(request, response) {
        try {
            const threadComments = await this.threadCommentService.getDocument();
            response.json(threadComments);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ThreadComment
    async getThreadCommentById(request, response) {
        try {
            const threadCommentId = request.params.id;
            const threadComment = await this.threadCommentService.getDocument(threadCommentId);
            response.json(threadComment);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ThreadCommentController;