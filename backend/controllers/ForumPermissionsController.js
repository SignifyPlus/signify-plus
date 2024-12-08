const ForumPermissions = require("../models/ForumPermissions")
const ForumPermissionsService = require("../services/ForumPermissionsService")
class ForumPermissionsController {
    
    //Get all ForumPermissionss
    static async getAllForumPermissionss(request, response) {
        try {
            const forumPermissionss = await ForumPermissionsService.getDocument();
            response.json(forumPermissionss);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumPermissions
    static async getForumPermissionsById(request, response) {
        try {
            const forumPermissionsId = request.params.id;
            const forumPermissions = await ForumPermissionsService.getDocument(forumPermissionsId);
            response.json(forumPermissions);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumPermissionsController;