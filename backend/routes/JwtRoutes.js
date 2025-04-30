const express = require('express');
const jwtRouter = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ControllerFactory = require('../factories/controllerFactory.js');

jwtRouter.get('/', async (request, response) => {
   return await ExceptionHelper.validate(null, 400, `Invalid path`, response);
});

jwtRouter.post(
   '/validate/',
   ControllerFactory.getJwtController().validateTokens,
);

module.exports = jwtRouter;
