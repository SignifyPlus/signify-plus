const express = require('express');
const userActivityRouter = express.Router();
const UserActivityController = require('../controllers/UserActivityController.js');


userActivityRouter.get('/', UserActivityController.getAllUserActivities);


module.exports = userActivityRouter;