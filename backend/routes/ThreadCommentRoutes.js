const express = require('express');
const threadCommentRouter = express.Router();
const ThreadCommentController = require('../controllers/ThreadCommentController.js');


threadCommentRouter.get('/', ThreadCommentController.getAllThreadComments);


module.exports = threadCommentRouter;