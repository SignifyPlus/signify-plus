const express = require('express');
const userActivityRouter = express.Router();
const UserActivityController = require('../controllers/UserActivityController.js');

const userActivityController = new UserActivityController();

userActivityRouter.get('/all', userActivityController.getAllUserActivities);

module.exports = userActivityRouter;