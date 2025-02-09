const SignifyException = require("../exception/SignifyException");
const Contact = require("../models/Contact")
const User = require("../models/User")
const ContactService = require("../services/ContactService")
const UserService = require("../services/UserService")
class ContactController {
    
    constructor(){
        //also maybe create singletons/statics out of these? 
        this.contactService = new ContactService(Contact);
        this.userService = new UserService(User);
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
    getAllContactsByPhoneNumber = async(request, response) => {
        try {
            //first fetch the main userId by querying user database, then send the contact information back to frontend
            if (request.params.phoneNumber == null) {
                const signifyException = new SignifyException(400, "phoneNumber Parameter is required");
                return response.status(signifyException.status).json(signifyException.loadResult())
            }

            const userPhoneNumber = request.params.phoneNumber;
            const user = await this.userService.getDocumentByCustomFilters({phoneNumber: userPhoneNumber});

            if (user == null) {
                const signifyException = new SignifyException(400, "User Doesn't Exist!");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            //in future use aggregates, better and powerful!
            const contactsQuery =  this.contactService.getDocumentsByCustomFiltersQuery({ "userId": user._id });
            const populatedContacts = await contactsQuery.populate({
                path: 'contactUserId',
                select: 'name phoneNumber profilePicture'
            }).exec();
            response.json(populatedContacts);
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

    //testing is left
    updateAllContactsById = async(request, response) => {
        try {
            const fieldsToUpdateArray = request.body.fieldsToUpdate;
            const id = request.params.id;

            if (fieldsToUpdateArray == null || id == null) {
                const signifyException = new SignifyException(400, "Id and FieldsToUpdate fields are required");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            const updatedContacts = await Promise.all(fieldsToUpdateArray.map(async (fields) => {
                return await this.contactService.updateDocument({id}, fields);
            }));

            response.json(updatedContacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    createContact = async(request, response) => {
        try {
            const contact = request.body;
            const contactObject = await this.contactService.saveDocument(contact);
            response.json(contactObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    deleteContactByIds = async(request, response) => {
        try {
            const userId = request.body.userId;
            const targetUserId = request.body.targetUserId;

            if (targetUserId == null || userId == null) {
                const signifyException = new SignifyException(400, "targetUserId and userId fields are required");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            const deletedContact = await this.contactService.deleteDocument({userId: userId, contactUserId: targetUserId});
            response.json(deletedContact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
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