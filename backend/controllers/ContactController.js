const Contact = require("../models/Contact")
const ContactService = require("../services/ContactService")
class ContactController {
    
    constructor(){
        this.contactService = new ContactService(Contact);
    }
    //Get all Contacts
    getAllContacts = async(request, response) => {
        try {
            const contacts = await this.contactService.getDocument();
            response.json(contacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //get all Contacts by Id
    getAllContactsById = async(request, response) => {
        try {
            const userId = request.params.id;

            //test this join operation tomorrow!
            const contacts = await this.contactService.getDocumentsByCustomFilters({userId}).populate({
                path: 'contactUserId',
                select: 'name phoneNumber'
            });
            response.json(contacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //to do
    updateAllContactsById = async(request, response) => {

    }

    //Get single Contact
    getContactById = async(request, response) =>{
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