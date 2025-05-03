const express = require('express');
const callHistoryRouter = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ContollerFactory = require('../factories/controllerFactory.js');

callHistoryRouter.get('/', async (request, response) => {
   return await ExceptionHelper.validate(
      null,
      400,
      `phoneNumber query parameter is required!`,
      response,
   );
});

callHistoryRouter.get(
   '/:phoneNumber',
   ContollerFactory.getCallHistoryController().getCallHistoryByUserId,
);

callHistoryRouter.get(
   '/create',
   ContollerFactory.getCallHistoryController().createCallHistoryRecord,
);

module.exports = callHistoryRouter;
