const express = require('express');
const chatRouter = express.Router();
const ChatController = require('../controllers/ChatController.js');

const chatController = new ChatController();

chatController.get('/:phoneNumber', chatController.getChatByPhoneNumber);

chatController.get('/:chatId');

module.exports = chatRouter;