const express = require('express');
const mediaRouter = express.Router();
const MediaController = require('../controllers/MediaController.js');


mediaRouter.get('/all', MediaController.getAllMedia);


module.exports = mediaRouter;