const express = require('express');
const threadRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

threadRouter.get('/all', ControllerFactory.getThreadController().getAllThreads);

module.exports = threadRouter;
