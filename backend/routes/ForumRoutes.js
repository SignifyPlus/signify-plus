const express = require('express');
const forumRouter = express.Router();
const ForumController = require('../controllers/ForumController.js');


forumRouter.get('/', ForumController.getAllForums);


module.exports = forumRouter;