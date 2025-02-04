const GroupMember = require("../models/GroupMember")
const GroupMemberService = require("../services/GroupMemberService")
class GroupMemberController {
    
    constructor(){
        this.groupMemberService = new GroupMemberService(GroupMember);
    }
    //Get all GroupMembers
    getAllGroupMembers = async(request, response) => {
        try {
            const groupMembers = await this.groupMemberService.getDocuments();
            response.json(groupMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single GroupMember
    getGroupMemberById = async(request, response) => {
        try {
            const groupMemberId = request.params.id;
            const groupMember = await this.groupMemberService.getDocumentById(groupMemberId);
            response.json(groupMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = GroupMemberController;