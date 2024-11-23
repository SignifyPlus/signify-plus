const ForumMember = require("../models/ForumMember")
const ForumMemberService = require("../services/ForumMemberService")
class ForumMemberController {
    
    //Get all ForumMembers
    static async getAllForumMembers(request, response) {
        try {
            const forumMembers = await ForumMemberService.getDocument();
            response.json(forumMembers);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }

    //Get single ForumMember
    static async getForumMemberById(request, response) {
        try {
            const forumMemberId = request.params.id;
            const forumMember = await ForumMemberService.getDocument(forumMemberId);
            response.json(forumMember);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }


}

modeule.exports = ForumMemberController;