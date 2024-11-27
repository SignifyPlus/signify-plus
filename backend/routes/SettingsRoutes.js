const express = require('express');
const settingsRouter = express.Router();
const SettingsController = require('../controllers/SettingsController.js');


settingsRouter.get('/', SettingsController.getAllSettings);


module.exports = settingsRouter;