const ForumPermissions = require("../models/ForumPermissions")
const ForumPermissionsService = require("../services/ForumPermissionsService")
class ForumPermissionsController {
    
    constructor(){
        this.forumPermissionsService = new ForumPermissionsService(ForumPermissions);
    }
    //Get all ForumPermissionss
    getAllForumPermissionss = async(request, response) =>{
        try {
            const forumPermissionss = await this.forumPermissionsService.getDocuments();
            response.json(forumPermissionss);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumPermissions
    getForumPermissionsById = async(request, response) => {
        try {
            const forumPermissionsId = request.params.id;
            const forumPermissions = await this.forumPermissionsService.getDocumentById(forumPermissionsId);
            response.json(forumPermissions);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumPermissionsController;