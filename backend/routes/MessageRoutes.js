const express = require('express');
const messageRouter = express.Router();
const MessageController = require('../controllers/MessageController.js');

const messageController = new MessageController();

messageRouter.post('/create', messageController.postMessage);

messageRouter.delete('/delete', messageController.deleteMessage)

module.exports = messageRouter;