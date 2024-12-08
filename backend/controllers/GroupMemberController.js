const GroupMember = require("../models/GroupMember")
const GroupMemberService = require("../services/GroupMemberService")
class GroupMemberController {
    
    //Get all GroupMembers
    static async getAllGroupMembers(request, response) {
        try {
            const groupMembers = await GroupMemberService.getDocument();
            response.json(groupMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single GroupMember
    static async getGroupMemberById(request, response) {
        try {
            const groupMemberId = request.params.id;
            const groupMember = await GroupMemberService.getDocument(groupMemberId);
            response.json(groupMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = GroupMemberController;