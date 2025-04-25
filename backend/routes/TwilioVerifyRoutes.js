const express = require('express');
const twilioVerifyRouter = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ControllerFactory = require('../factories/controllerFactory.js');

twilioVerifyRouter.get('/', async (request, response) => {
   return await ExceptionHelper.validate(
      null,
      400,
      `phoneNumber query parameter is required!`,
      response,
   );
});

twilioVerifyRouter.get(
   '/getOtp/:phoneNumber',
   ControllerFactory.getTwilioOtpController().getOtp,
);

twilioVerifyRouter.post(
   '/verifyOtp',
   ControllerFactory.getTwilioOtpController().verifyOtp,
);

module.exports = twilioVerifyRouter;
