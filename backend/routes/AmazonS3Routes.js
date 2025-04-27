const express = require('express');
const amazonS3Router = express.Router();
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const ControllerFactory = require('../factories/controllerFactory.js');

amazonS3Router.post(
   '/s3/',
   ControllerFactory.getAmazonS3Controller()
      .getPresignedS3ProfilePicturebucketUrl,
);

module.exports = amazonS3Router;
