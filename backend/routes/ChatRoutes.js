const express = require('express');
const chatRouter = express.Router();
const ChatController = require('../controllers/ChatController.js');

const chatController = new ChatController();

chatRouter.get('/:phoneNumber', chatController.getChatByPhoneNumber);

chatRouter.get('/custom/id/:chatId', chatController.getChatHistoryById);

chatRouter.post('/create', chatController.initializeEmptyChat);

module.exports = chatRouter;