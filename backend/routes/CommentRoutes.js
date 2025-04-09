const express = require('express');
const commentRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

commentRouter.get(
   '/all',
   ControllerFactory.getCommentController().getAllComments,
);

module.exports = commentRouter;
