const express = require('express');
const messageRouter = express.Router();
const MessageController = require('../controllers/MessageController.js');

const messageController = new MessageController();

messageRouter.get('/all', messageController.getAllMessages);

module.exports = messageRouter;