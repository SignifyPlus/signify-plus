const express = require('express');
const messageRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

messageRouter.post(
   '/create',
   ControllerFactory.getMessageController().postMessage,
);

messageRouter.delete(
   '/delete',
   ControllerFactory.getMessageController().deleteMessage,
);

module.exports = messageRouter;
