const express = require('express');
const twilioVerifyRouter = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ControllerFactory = require('../factories/controllerFactory.js');


twilioVerifyRouter.post(
   '/getOtp',
   ControllerFactory.getTwilioOtpController().getOtp
);

twilioVerifyRouter.post(
   '/verifyOtp',
   ControllerFactory.getTwilioOtpController().verifyOtp,
);

module.exports = twilioVerifyRouter;
