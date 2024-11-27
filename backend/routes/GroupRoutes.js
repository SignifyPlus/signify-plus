const express = require('express');
const groupRouter = express.Router();
const GroupController = require('../controllers/GroupController.js');


groupRouter.get('/', GroupController.getAllGroups);


module.exports = groupRouter;