const express = require('express');
const settingsRouter = express.Router();
const SettingsController = require('../controllers/SettingsController.js');

const settingsController = new SettingsController();

settingsRouter.get('/all', settingsController.getAllSettings);

module.exports = settingsRouter;