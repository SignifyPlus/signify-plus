const express = require('express');
const forumPermissionsRouter = express.Router();
const ForumPermissionsController = require('../controllers/ForumPermissionsController.js');


forumPermissionsRouter.get('/all', ForumPermissionsController.getAllForumPermissionss);


module.exports = forumPermissionsRouter;