const express = require('express');
const groupMemberRouter = express.Router();
const GroupMemberController = require('../controllers/GroupMemberController.js');

const groupMemberController = new GroupMemberController();

groupMemberRouter.get('/all', groupMemberController.getAllGroupMembers);

module.exports = groupMemberRouter;
