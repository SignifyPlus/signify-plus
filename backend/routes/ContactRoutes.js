const express = require('express');
const contactRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

//test these
contactRouter.get('/all', ControllerFactory.getContactController().getAllContacts);

contactRouter.get('/:phoneNumber', ControllerFactory.getContactController().getAllContactsByPhoneNumber);

contactRouter.put('/update/', ControllerFactory.getContactController().updateContactByCustomFilter);

contactRouter.put('/update/all/:id', ControllerFactory.getContactController().updateAllContactsById);

contactRouter.post('/create', ControllerFactory.getContactController().createContact);

contactRouter.delete('/delete', ControllerFactory.getContactController().deleteContactByIds)

module.exports = contactRouter;