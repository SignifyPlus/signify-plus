const ServiceFactory = require("../factories/serviceFactory.js");
class GroupMemberController {
    
    constructor(){
    }
    //Get all GroupMembers
    getAllGroupMembers = async(request, response) => {
        try {
            const groupMembers = await ServiceFactory.getGroupMemberService.getDocuments();
            response.json(groupMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single GroupMember
    getGroupMemberById = async(request, response) => {
        try {
            const groupMemberId = request.params.id;
            const groupMember = await ServiceFactory.getGroupMemberService.getDocumentById(groupMemberId);
            response.json(groupMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = GroupMemberController;