const express = require('express');
const reactionRouter = express.Router();
const ReactionController = require('../controllers/ReactionController.js');

const reactionController = new ReactionController();

reactionRouter.get('/all', reactionController.getAllReactions);

module.exports = reactionRouter;