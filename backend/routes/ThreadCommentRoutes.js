const express = require('express');
const threadCommentRouter = express.Router();
const ThreadCommentController = require('../controllers/ThreadCommentController.js');


threadCommentRouter.get('/all', ThreadCommentController.getAllThreadComments);


module.exports = threadCommentRouter;