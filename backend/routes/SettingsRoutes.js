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

settingsRouter.get(
   '/:phoneNumber',
   ControllerFactory.getSettingsController().getSettingsByPhoneNumber,
);

settingsRouter.put(
   '/update/',
   ControllerFactory.getSettingsController().updateAccessibilitySettings,
);

module.exports = settingsRouter;
