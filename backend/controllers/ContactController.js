const SignifyException = require("../exception/SignifyException");
const Contact = require("../models/Contact")
const ContactService = require("../services/ContactService")
class ContactController {
    
    constructor(){
        this.contactService = new ContactService(Contact);
    }
    //Get all Contacts
    getAllContacts = async(request, response) => {
        try {
            const contacts = await this.contactService.getDocuments();
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

    updateContactByCustomFilter = async(request, response) => {
        try {
            const filters = request.body.filters;
            const fieldsToUpdate = request.body.fieldsToUpdate;
            
            if (filters == null || fieldsToUpdate == null) {
                const signifyException = new SignifyException(400, "Filters and FieldsToUpdate fields are required");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            const contact = await this.contactService.updateDocument(filters, fieldsToUpdate);
            response.json(contact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    updateAllContactsById = async(request, response) => {
        try {
            const fieldsToUpdate = request.body.fieldsToUpdate;
            const id = request.params.id;

            if (fieldsToUpdate == null || id == null) {
                const signifyException = new SignifyException(400, "Id and FieldsToUpdate fields are required");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            //fix this tomorrow + test
            await Promise.all(fieldsToUpdate.map(async (element) => {
                await this.contactService.updateDocument({id}, fieldsToUpdate);
            }));
            response.json(contact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    createContact = async(request, response) => {

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