const express = require('express');
const forumMemberRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

forumMemberRouter.get(
   '/all',
   ControllerFactory.getForumMemberController().getAllForumMembers,
);

forumMemberRouter.get(
   '/id/:id',
   ControllerFactory.getForumMemberController().getForumMemberRecordsByUserId,
);

forumMemberRouter.get(
   '/:phoneNumber',
   ControllerFactory.getForumMemberController().getForumsByPhoneNumber,
);

forumMemberRouter.get(
   '/forumId/:id',
   ControllerFactory.getForumMemberController().getForumMembersByForumId,
);

forumMemberRouter.post(
   '/create',
   ControllerFactory.getForumMemberController().createForumMember,
);

module.exports = forumMemberRouter;
