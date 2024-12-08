const express = require('express');
const groupMemberRouter = express.Router();
const GroupMemberController = require('../controllers/GroupMemberController.js');


groupMemberRouter.get('/all', GroupMemberController.getAllGroupMembers);


module.exports = groupMemberRouter;