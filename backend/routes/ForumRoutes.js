const express = require('express');
const forumRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

forumRouter.get('/all', ControllerFactory.getForumController().getAllForums);

forumRouter.get('/:id', ControllerFactory.getForumController().getForumById);

forumRouter.post('/create', ControllerFactory.getForumController().createForum);

module.exports = forumRouter;
