const express = require('express');
const userAuthenticationRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

userAuthenticationRouter.get(
   '/all',
   ControllerFactory.getUserAuthenticationController()
      .getAllUserAuthenticationRecords,
);

userAuthenticationRouter.post(
   '/create/',
   ControllerFactory.getUserAuthenticationController()
      .createUserAuthenticationRecord,
);

userAuthenticationRouter.put(
   '/update/',
   ControllerFactory.getUserAuthenticationController()
      .updateUserAuthenticationRecord,
);

module.exports = userAuthenticationRouter;
