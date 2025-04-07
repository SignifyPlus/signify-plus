const express = require('express');
const forumPermissionsRouter = express.Router();
const ForumPermissionsController = require('../controllers/ForumPermissionsController.js');

const forumPermissionsController = new ForumPermissionsController();

forumPermissionsRouter.get(
   '/all',
   forumPermissionsController.getAllForumPermissionss,
);

module.exports = forumPermissionsRouter;
