const ServiceFactory = require("../factories/serviceFactory.js");
class ForumPermissionsController {
    
    constructor(){
    }
    //Get all ForumPermissionss
    getAllForumPermissionss = async(request, response) =>{
        try {
            const forumPermissionss = await ServiceFactory.getForumPermissionsService.getDocuments();
            response.json(forumPermissionss);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumPermissions
    getForumPermissionsById = async(request, response) => {
        try {
            const forumPermissionsId = request.params.id;
            const forumPermissions = await ServiceFactory.getForumPermissionsService.getDocumentById(forumPermissionsId);
            response.json(forumPermissions);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = ForumPermissionsController;