const ServiceFactory = require("../factories/serviceFactory.js");
class ForumController {
    
    constructor(){
    }
    //Get all Forums
    getAllForums = async(request, response) => {
        try {
            const forums = await ServiceFactory.getForumService.getDocumentsByCustomFilters();
            response.json(forums);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Forum
    getForumById = async(request, response) => {
        try {
            const forumId = request.params.id;
            const forum = await ServiceFactory.getForumService.getDocumentById(forumId);
            response.json(forum);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = ForumController;