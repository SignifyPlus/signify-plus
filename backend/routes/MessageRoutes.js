const express = require('express');
const messageRouter = express.Router();
const MessageController = require('../controllers/MessageController.js');


messageRouter.get('/', MessageController.getAllMessages);


module.exports = messageRouter;