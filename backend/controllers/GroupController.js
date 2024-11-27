const Group = require("../models/Group")
const GroupService = require("../services/GroupService")
class GroupController {
    
    //Get all Groups
    static async getAllGroups(request, response) {
        try {
            const groups = await GroupService.getDocument();
            response.json(groups);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Group
    static async getGroupById(request, response) {
        try {
            const groupId = request.params.id;
            const group = await GroupService.getDocument(groupId);
            response.json(group);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = GroupController;