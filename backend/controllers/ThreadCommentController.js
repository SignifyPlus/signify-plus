const ServiceFactory = require("../factories/serviceFactory.js");
class ThreadCommentController {
    
    constructor(){
    }

    //Get all ThreadComments
    getAllThreadComments = async(request, response) =>{
        try {
            const threadComments = await ServiceFactory.getThreadCommentService.getDocuments();
            response.json(threadComments);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ThreadComment
    getThreadCommentById = async(request, response) =>{
        try {
            const threadCommentId = request.params.id;
            const threadComment = await ServiceFactory.getThreadCommentService.getDocumentById(threadCommentId);
            response.json(threadComment);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = ThreadCommentController;