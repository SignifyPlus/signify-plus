const ContactController = require('../../../controllers/ContactController');
const ServiceFactory = require('../../../factories/serviceFactory');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../factories/serviceFactory', () => ({
    getContactService: {
        getDocuments: jest.fn(),
        getDocumentsByCustomFiltersQuery: jest.fn(),
        updateDocument: jest.fn(),
        deleteDocuments: jest.fn(),
        saveDocuments: jest.fn(),
        deleteDocument: jest.fn(),
        getDocument: jest.fn(),
    },
    getUserService: {
        getDocumentByCustomFilters: jest.fn(),
        getDocumentsByCustomFilters: jest.fn(),
    },
}));

jest.mock('../../../exception/SignifyException', () => {
    return jest.fn().mockImplementation((status, message) => ({
        status,
        loadResult: () => ({ error: message }),
    }));
});

describe('ContactController Unit Test', () => {
    let contactController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        contactController = new ContactController();
        reqMock = { body: {}, params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllContacts', () => {
        it('should return all contacts', async () => {
            ServiceFactory.getContactService.getDocuments.mockResolvedValue(['contact1']);
            await contactController.getAllContacts(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith(['contact1']);
        });
    });

    describe('getContactById', () => {
        it('should return a contact by ID', async () => {
            reqMock.params.id = '123';
            ServiceFactory.getContactService.getDocument.mockResolvedValue('contact1');
            await contactController.getContactById(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith('contact1');
        });
    });

    describe('deleteContactByIds', () => {
        it('should delete a contact by userId and targetUserId', async () => {
            reqMock.body = { userId: 'user1', targetUserId: 'user2' };
            ServiceFactory.getContactService.deleteDocument.mockResolvedValue('deleted');
            await contactController.deleteContactByIds(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith('deleted');
        });
    });

    describe('updateContactByCustomFilter', () => {
        it('should update a contact with filters and fields', async () => {
            reqMock.body = { filters: { id: 1 }, fieldsToUpdate: { name: 'updated' } };
            ServiceFactory.getContactService.updateDocument.mockResolvedValue('updatedContact');
            await contactController.updateContactByCustomFilter(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith('updatedContact');
        });
    });

    describe('updateAllContactsById', () => {
        it('should update multiple contacts', async () => {
            reqMock.params.id = 'user1';
            reqMock.body.fieldsToUpdate = [{ name: 'newName' }];
            ServiceFactory.getContactService.updateDocument.mockResolvedValue('updated');
            await contactController.updateAllContactsById(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalled();
        });
    });

    describe('createContact', () => {
        it('should add and remove contacts successfully', async () => {
            reqMock.body = { userPhoneNumber: '1234567890', contacts: ['9876543210'] };
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'mainUserId' });
            ServiceFactory.getUserService.getDocumentsByCustomFilters.mockResolvedValue([{ _id: 'userId' }]);
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([{ contactUserId: { _id: 'anotherUserId' }, _id: 'contactId' }]),
            };
            ServiceFactory.getContactService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);
            await contactController.createContact(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String),
                added: expect.any(Number),
                removed: expect.any(Number),
            }));
        });
    });

    describe('getAllContactsByPhoneNumber', () => {
        it('should return contacts for a given phone number', async () => {
            reqMock.params.phoneNumber = '1234567890';
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'userId' });
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(['contact1']),
            };
            ServiceFactory.getContactService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);
            await contactController.getAllContactsByPhoneNumber(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith(['contact1']);
        });
    });
});