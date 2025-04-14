const express = require('express');
const settingsRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

settingsRouter.get(
   '/id/:id',
   ControllerFactory.getSettingsController().getSettingsById,
);

settingsRouter.post(
   '/default/create',
   ControllerFactory.getSettingsController().createDefaultAccessibilitySettings,
);

module.exports = settingsRouter;
