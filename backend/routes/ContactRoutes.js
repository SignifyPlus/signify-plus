const express = require('express');
const contactRouter = express.Router();
const ContactController = require('../controllers/ContactController.js');

const contactController = new ContactController();

contactRouter.get('/all', contactController.getAllContacts);

contactRouter.get('/:id', contactController.getAllContactsById);

contactRouter.put('/update/:id', contactController.updateAllContactsById)

module.exports = contactRouter;