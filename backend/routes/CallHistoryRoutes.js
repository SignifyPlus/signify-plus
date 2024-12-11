const express = require('express');
const callHistoryRouter = express.Router();
const CallHistoryController = require('../controllers/CallHistoryController.js');

const callHistoryController = new CallHistoryController();

callHistoryRouter.get('/all', callHistoryController.getCallHistory);

module.exports = callHistoryRouter;