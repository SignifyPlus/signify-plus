const express = require('express');
const notificationRouter = express.Router();
const NotificationController = require('../controllers/NotificationController.js');

const notificationController = new NotificationController();

notificationRouter.get('/all', notificationController.getAllNotifications);

module.exports = notificationRouter;