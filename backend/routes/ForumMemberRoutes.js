const express = require('express');
const forumMemberRouter = express.Router();
const ForumMemberController = require('../controllers/ForumMemberController.js');

const forumMemberController = new ForumMemberController();

forumMemberRouter.get('/all', forumMemberController.getAllForumMembers);

module.exports = forumMemberRouter;