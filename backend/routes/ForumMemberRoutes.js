const express = require('express');
const forumMemberRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

forumMemberRouter.get(
   '/all',
   ControllerFactory.getForumMemberController().getAllForumMembers,
);

forumMemberRouter.get(
   '/id/:id',
   ControllerFactory.getForumMemberController().getForumMemberByUserId,
);

forumMemberRouter.get(
   '/:phoneNumber',
   ControllerFactory.getForumMemberController().getForumsByPhoneNumber,
);

forumMemberRouter.get(
   '/forumId/:id',
   ControllerFactory.getForumMemberController().getForumMembersByForumId,
);

module.exports = forumMemberRouter;
