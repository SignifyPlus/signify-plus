const express = require('express');
const userAuthenticationRouter = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ControllerFactory = require('../factories/controllerFactory.js');

userAuthenticationRouter.get('/', async (request, response) => {
   return await ExceptionHelper.validate(
      null,
      400,
      `phoneNumber query parameter is required!`,
      response,
   );
});

userAuthenticationRouter.get(
   '/:phoneNumber',
   ControllerFactory.getUserAuthenticationController()
      .getUserAuthenticationRecord,
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
