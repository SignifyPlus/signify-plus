const express = require('express');
const chatRouter = express.Router();
const ChatController = require('../controllers/ChatController.js');

const chatController = new ChatController();

chatRouter.get('/:phoneNumber', chatController.getChatByPhoneNumber);

chatRouter.post('/create', chatController.initializeEmptyChat);

chatRouter.get('/:chatId');

module.exports = chatRouter;