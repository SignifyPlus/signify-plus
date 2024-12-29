const Group = require("../models/Group")
const GroupService = require("../services/GroupService")
class GroupController {
    
    constructor(){
        this.groupService = new GroupService(Group);
    }
    //Get all Groups
    getAllGroups = async(request, response) => {
        try {
            const groups = await this.groupService.getDocument();
            response.json(groups);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Group
    getGroupById = async(request, response) => {
        try {
            const groupId = request.params.id;
            const group = await this.groupService.getDocument(groupId);
            response.json(group);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}
module.exports = GroupController;