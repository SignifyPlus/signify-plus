const express = require('express');
const contactRouter = express.Router();
const ContactController = require('../controllers/ContactController.js');


contactRouter.get('/', ContactController.getAllContacts);


module.exports = contactRouter;