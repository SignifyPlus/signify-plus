const ThreadComment = require("../models/ThreadComment")
const ThreadCommentService = require("../services/ThreadCommentService")
class ThreadCommentController {
    
    constructor(){
        this.threadCommentService = new ThreadCommentService(ThreadComment);
    }
    //Get all ThreadComments
    getAllThreadComments = async(request, response) =>{
        try {
            const threadComments = await this.threadCommentService.getDocuments();
            response.json(threadComments);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ThreadComment
    getThreadCommentById = async(request, response) =>{
        try {
            const threadCommentId = request.params.id;
            const threadComment = await this.threadCommentService.getDocumentById(threadCommentId);
            response.json(threadComment);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ThreadCommentController;