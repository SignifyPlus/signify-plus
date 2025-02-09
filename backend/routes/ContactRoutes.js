const express = require('express');
const contactRouter = express.Router();
const ContactController = require('../controllers/ContactController.js');

const contactController = new ContactController();

//test these
contactRouter.get('/all', contactController.getAllContacts);

contactRouter.get('/:phoneNumber', contactController.getAllContactsByPhoneNumber);

contactRouter.put('/update/', contactController.updateContactByCustomFilter);

contactRouter.put('/update/all/:id', contactController.updateAllContactsById);

contactRouter.post('/create', contactController.createContact);

contactRouter.delete('/delete', contactController.deleteContactByIds)

module.exports = contactRouter;