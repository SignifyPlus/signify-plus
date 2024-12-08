const express = require('express');
const forumThreadRouter = express.Router();
const ForumThreadController = require('../controllers/ForumThreadController.js');


forumThreadRouter.get('/all', ForumThreadController.getAllForumThreads);


module.exports = forumThreadRouter;