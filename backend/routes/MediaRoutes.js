const express = require('express');
const mediaRouter = express.Router();
const MediaController = require('../controllers/MediaController.js');

const mediaController = new MediaController();

mediaRouter.get('/all', mediaController.getAllMedia);

module.exports = mediaRouter;
