const express = require('express');
const forumMemberRouter = express.Router();
const ForumMemberController = require('../controllers/ForumMemberController.js');


forumMemberRouter.get('/', ForumMemberController.getAllForumMembers);


module.exports = forumMemberRouter;