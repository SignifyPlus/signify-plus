const express = require('express');
const callHistoryRouter = express.Router();
const CallHistoryController = require('../controllers/CallHistoryController.js');


callHistoryRouter.get('/all', CallHistoryController.getCallHistory);


module.exports = callHistoryRouter;