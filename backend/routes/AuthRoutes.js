const express = require('express');
const authRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

authRouter.post('/users/login', ControllerFactory.getUserController().login);

authRouter.post(
   '/users/create',
   ControllerFactory.getUserController().createUser,
);

module.exports = authRouter;
