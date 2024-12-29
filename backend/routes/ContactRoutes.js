const express = require('express');
const contactRouter = express.Router();
const ContactController = require('../controllers/ContactController.js');

const contactController = new ContactController();

contactRouter.get('/all', contactController.getAllContacts);

module.exports = contactRouter;