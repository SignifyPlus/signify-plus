const express = require('express');
const forumPermissionsRouter = express.Router();
const ForumPermissionsController = require('../controllers/ForumPermissionsController.js');


forumPermissionsRouter.get('/', ForumPermissionsController.getAllForumPermissionss);


module.exports = forumPermissionsRouter;