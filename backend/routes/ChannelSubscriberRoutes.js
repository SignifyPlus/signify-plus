const express = require('express');
const channelSubcriberRouter = express.Router();
const ChannelSubcriberController = require('../controllers/ChannelSubscriberController.js');

const channelSubcriberController = new ChannelSubcriberController();

channelSubcriberRouter.get(
   '/all',
   channelSubcriberController.getAllChannelSubscribers,
);

module.exports = channelSubcriberRouter;
