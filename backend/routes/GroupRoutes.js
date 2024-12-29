const express = require('express');
const groupRouter = express.Router();
const GroupController = require('../controllers/GroupController.js');


const groupController = new GroupController();

groupRouter.get('/all', groupController.getAllGroups);

module.exports = groupRouter;