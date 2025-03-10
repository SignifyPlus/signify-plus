const express = require('express');
const userActivityRouter = express.Router();
const ControllerFactory = require("../factories/controllerFactory.js");


userActivityRouter.get('/all', ControllerFactory.getUserActivitiyController.getAllUserActivities);

module.exports = userActivityRouter;