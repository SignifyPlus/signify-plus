const express = require('express');
const forumRouter = express.Router();
const ForumController = require('../controllers/ForumController.js');

const forumController = new ForumController();

forumRouter.get('/all', forumController.getAllForums);

module.exports = forumRouter;