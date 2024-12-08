const express = require('express');
const channelRouter = express.Router();
const ChannelController = require('../controllers/ChannelController.js');


channelRouter.get('/all', ChannelController.getAllChannels);


module.exports = channelRouter;