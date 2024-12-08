const express = require('express');
const reactionRouter = express.Router();
const ReactionController = require('../controllers/ReactionController.js');


reactionRouter.get('/all', ReactionController.getAllReactions);


module.exports = reactionRouter;