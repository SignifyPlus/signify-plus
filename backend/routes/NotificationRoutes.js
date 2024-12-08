const express = require('express');
const notificationRouter = express.Router();
const NotificationController = require('../controllers/NotificationController.js');


notificationRouter.get('/all', NotificationController.getAllNotifications);


module.exports = notificationRouter;