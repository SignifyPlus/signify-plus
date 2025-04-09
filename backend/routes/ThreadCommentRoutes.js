const express = require('express');
const threadCommentRouter = express.Router();
const ThreadCommentController = require('../controllers/ThreadCommentController.js');

const threadCommentController = new ThreadCommentController();

threadCommentRouter.get('/all', threadCommentController.getAllThreadComments);

module.exports = threadCommentRouter;
