const express = require('express');
const chatRouter = express.Router();
const ExceptionHelper = require("../exception/ExceptionHelper.js");
const ChatController = require('../controllers/ChatController.js');

const chatController = new ChatController();

chatRouter.get('/', async (request, response) => { //default for phoneNumber endpoint -> use this for other routers too if a parameter is missing because the route never reaches the controller so needs to be delt here
    return await ExceptionHelper.validate(null, 400, `phoneNumber is not provided.`, response);
});

chatRouter.get('/:phoneNumber', chatController.getChatByPhoneNumber);

chatRouter.get('/custom/id/:chatId', chatController.getChatHistoryById);

chatRouter.post('/create', chatController.initializeEmptyChat);

module.exports = chatRouter;