const express = require('express');
const forumThreadRouter = express.Router();
const ForumThreadController = require('../controllers/ForumThreadController.js');

const forumThreadController = new ForumThreadController();

forumThreadRouter.get('/all', forumThreadController.getAllForumThreads);

module.exports = forumThreadRouter;
