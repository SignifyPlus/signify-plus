const SignifyException = require("../exception/SignifyException");
const ServiceFactory = require("../factories/serviceFactory.js");
class ContactController {
    constructor(){
    }

    //Get all Contacts
    getAllContacts = async(request, response) => {
        try {
            const contacts = await ServiceFactory.getContactService.getDocuments();
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
            const user = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: userPhoneNumber});

            if (user == null) {
                const signifyException = new SignifyException(400, "User Doesn't Exist!");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            //in future use aggregates, better and powerful!
            const contactsQuery =  ServiceFactory.getContactService.getDocumentsByCustomFiltersQuery({ "userId": user._id });
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
            const contact = await ServiceFactory.getContactService.updateDocument(filters, fieldsToUpdate);
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
                return await ServiceFactory.getContactService.updateDocument({id}, fields);
            }));

            response.json(updatedContacts);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //A list will be send with the contacts and userPhone Number - to check automatically which are missing from the list, and delete them automatically
    //Otherwise add if there's an extra entry in the array
    createContact = async(request, response) => {
        try {
            const userPhoneNumber = request.body.userPhoneNumber;
            const contacts = request.body.contacts;

            if (userPhoneNumber == null || contacts == null || contacts.length == 0) {
                const signifyException = new SignifyException(400, "userPhoneNumber and contacts are required. Either the array is null or empty or the userPhoneNumber is not provided. Please check!");
                return response.status(signifyException.status).json(signifyException.loadResult());
            }

            const mainUser = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: userPhoneNumber});

            if (mainUser == null) {
                const signifyException = new SignifyException(400, `No Such user exists with the phoneNumber : ${userPhoneNumber}!`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }

            //User Ids from the given contact numbers
            const contactUsers = await ServiceFactory.getUserService.getDocumentsByCustomFilters({ phoneNumber: { $in: contacts } });
            const newContactUserIds = contactUsers.map(user => user._id.toString());

            //Existing contact numbers for the main user
            const existingContacts = ServiceFactory.getContactService.getDocumentsByCustomFiltersQuery({userId: mainUser._id});
            const populatedContacts = await existingContacts.populate({
                path: 'contactUserId',
                select: 'phoneNumber'
            }).exec();
            const existingUserIds = populatedContacts.map(contact => contact.contactUserId._id.toString());
        
            //contacts to delete
            const contactsToDelete = populatedContacts.filter(contact => !newContactUserIds.includes(contact.contactUserId._id.toString())).map(contact => contact._id);

            //contacts to add - validation is left ,what if the userId doesn't even exist in the user table!
            const contactsToAdd = newContactUserIds.filter(userId => !existingUserIds.includes(userId))
            .map(userId => ({
                userId: mainUser._id,
                contactUserId: userId,
                status: true
            }));

            if (contactsToDelete.length > 0) {
                await ServiceFactory.getContactService.deleteDocuments({_id: {$in: contactsToDelete}});
            }

            if (contactsToAdd.length > 0) {
                await ServiceFactory.getContactService.saveDocuments(contactsToAdd);
            }

            response.json({
                message: "Contacts Updated successfully",
                added: contactsToAdd.length,
                removed: contactsToDelete.length
            });

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
            const deletedContact = await ServiceFactory.getContactService.deleteDocument({userId: userId, contactUserId: targetUserId});
            response.json(deletedContact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Contact
    getContactById = async(request, response) =>{
        try {
            const contactId = request.params.id;
            const contact = await ServiceFactory.getContactService.getDocument(contactId);
            response.json(contact);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = ContactController;