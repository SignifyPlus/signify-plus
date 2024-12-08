const Contact = require("../models/Contact")
const ContactService = require("../services/ContactService")
class ContactController {
    
    constructor(){
        this.contactService = new ContactService(Contact);
        this.getAllContacts = this.getAllContacts.bind(this);
        this.getContactById = this.getContactById.bind(this);
    }
    //Get all Contacts
    async getAllContacts(request, response) {
        try {
            const contacts = await this.contactService.getDocument();
            response.json(contacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Contact
    async getContactById(request, response) {
        try {
            const contactId = request.params.id;
            const contact = await this.contactService.getDocument(contactId);
            response.json(contact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ContactController;