const Contact = require("../models/Contact")
const ContactService = require("../services/ContactService")
class ContactController {
    
    //Get all Contacts
    static async getAllContacts(request, response) {
        try {
            const contacts = await ContactService.getDocument();
            response.json(contacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Contact
    static async getContactById(request, response) {
        try {
            const contactId = request.params.id;
            const contact = await ContactService.getDocument(contactId);
            response.json(contact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ContactController;