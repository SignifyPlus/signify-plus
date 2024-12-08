const GroupMember = require("../models/GroupMember")
const GroupMemberService = require("../services/GroupMemberService")
class GroupMemberController {
    
    constructor(){
        this.groupMemberService = new GroupMemberService(GroupMember);
        this.getAllGroupMembers = this.getAllGroupMembers.bind(this);
        this.getGroupMemberById = this.getGroupMemberById.bind(this);
    }
    //Get all GroupMembers
    async getAllGroupMembers(request, response) {
        try {
            const groupMembers = await this.groupMemberService.getDocument();
            response.json(groupMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single GroupMember
    async getGroupMemberById(request, response) {
        try {
            const groupMemberId = request.params.id;
            const groupMember = await this.groupMemberService.getDocument(groupMemberId);
            response.json(groupMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = GroupMemberController;