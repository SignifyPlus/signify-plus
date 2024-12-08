const ForumMember = require("../models/ForumMember")
const ForumMemberService = require("../services/ForumMemberService")
class ForumMemberController {
    
    constructor(){
        this.forumMemberService = new ForumMemberService(ForumMember);
        this.getAllForumMembers = this.getAllForumMembers.bind(this);
        this.getForumMemberById = this.getForumMemberById.bind(this);
    }
    //Get all ForumMembers
    async getAllForumMembers(request, response) {
        try {
            const forumMembers = await this.forumMemberService.getDocument();
            response.json(forumMembers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ForumMember
    async getForumMemberById(request, response) {
        try {
            const forumMemberId = request.params.id;
            const forumMember = await this.forumMemberService.getDocument(forumMemberId);
            response.json(forumMember);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ForumMemberController;