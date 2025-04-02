const express = require('express');
const forumRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

forumRouter.get('/all', ControllerFactory.getForumController().getAllForums);

forumRouter.get('/id/:id', ControllerFactory.getForumController().getForumById);

forumRouter.get(
   '/:phoneNumber',
   ControllerFactory.getForumController().getForumsByPhoneNumber,
);

forumRouter.post('/create', ControllerFactory.getForumController().createForum);

module.exports = forumRouter;
