const express = require('express');
const reportRouter = express.Router();
const ReportController = require('../controllers/ReportController.js');


reportRouter.get('/', ReportController.getAllReports);


module.exports = reportRouter;