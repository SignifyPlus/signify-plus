const ForumMember = require("../models/ForumMember")
const ForumMemberService = require("../services/ForumMemberService")
class ForumMemberController {
    
    constructor(){
        this.forumMemberService = new ForumMemberService(ForumMember);
    }
    //Get all ForumMembers
    getAllForumMembers = async(request, response) =>{
        try {
            const forumMembers = await this.forumMemberService.getDocuments();
            response.json(forumMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumMember
    getForumMemberById = async(request, response) => {
        try {
            const forumMemberId = request.params.id;
            const forumMember = await this.forumMemberService.getDocumentById(forumMemberId);
            response.json(forumMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumMemberController;