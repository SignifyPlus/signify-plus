const express = require('express');
const channelRouter = express.Router();
const ChannelController = require('../controllers/ChannelController.js');

const channelController = new ChannelController();

channelRouter.get('/all', channelController.getAllChannels);

module.exports = channelRouter;
