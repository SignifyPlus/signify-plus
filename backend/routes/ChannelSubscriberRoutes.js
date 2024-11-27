const express = require('express');
const channelSubcriberRouter = express.Router();
const channelSubcriberController = require('../controllers/ChannelSubscriberController.js');


channelSubcriberRouter.get('/', channelSubcriberController.getAllChannelSubscribers);


module.exports = channelSubcriberRoute;r