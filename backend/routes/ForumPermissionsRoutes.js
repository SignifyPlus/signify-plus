const express = require('express');
const signifyPlusRouter = express.Router();
const UserActivityController = require('../controllers/UserActivityController.js');


signifyPlusRouter.get('/', UserActivityController.getAllUserActivities());


module.exports = signifyPlusRouter