const express = require('express');
const reactionRouter = express.Router();
const ReactionController = require('../controllers/ReactionController.js');


reactionRouter.get('/', ReactionController.getAllReactions);


module.exports = reactionRouter;