const ThreadComment = require("../models/ThreadComment")
const ThreadCommentService = require("../services/ThreadCommentService")
class ThreadCommentController {
    
    //Get all ThreadComments
    static async getAllThreadComments(request, response) {
        try {
            const threadComments = await ThreadCommentService.getDocument();
            response.json(threadComments);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ThreadComment
    static async getThreadCommentById(request, response) {
        try {
            const threadCommentId = request.params.id;
            const threadComment = await ThreadCommentService.getDocument(threadCommentId);
            response.json(threadComment);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = ThreadCommentController;