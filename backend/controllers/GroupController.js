const Group = require("../models/Group")
const GroupService = require("../services/GroupService")
class GroupController {
    
    constructor(){
        this.groupService = new GroupService(Group);
        this.getAllGroups = this.getAllGroups.bind(this);
        this.getGroupById = this.getGroupById.bind(this);
    }
    //Get all Groups
    async getAllGroups(request, response) {
        try {
            const groups = await this.groupService.getDocument();
            response.json(groups);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Group
    async getGroupById(request, response) {
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