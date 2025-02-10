const ServiceFactory = require("../factories/serviceFactory.js");
class GroupController {
    
    constructor(){
    }
    //Get all Groups
    getAllGroups = async(request, response) => {
        try {
            const groups = await ServiceFactory.getGroupService.getDocuments();
            response.json(groups);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Group
    getGroupById = async(request, response) => {
        try {
            const groupId = request.params.id;
            const group = await ServiceFactory.getGroupService.getDocumentById(groupId);
            response.json(group);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}
module.exports = GroupController;