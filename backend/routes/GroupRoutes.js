const express = require('express');
const groupRouter = express.Router();
const GroupController = require('../controllers/GroupController.js');


groupRouter.get('/all', GroupController.getAllGroups);


module.exports = groupRouter;