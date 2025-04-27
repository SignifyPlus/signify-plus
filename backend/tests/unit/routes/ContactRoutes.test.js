const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete
    })
}));

const mockGetContactController = jest.fn().mockReturnValue({
    getAllContacts: 'mockGetAllContacts',
    getAllContactsByPhoneNumber: 'mockGetAllContactsByPhoneNumber',
    updateContactByCustomFilter: 'mockUpdateContactByCustomFilter',
    updateAllContactsById: 'mockUpdateAllContactsById',
    createContact: 'mockCreateContact',
    deleteContactByIds: 'mockDeleteContactByIds'
});

jest.mock('../../../factories/controllerFactory', () => ({
    getContactController: mockGetContactController
}));

describe('ContactRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockPut.mockClear();
        mockDelete.mockClear();
        mockGetContactController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ContactRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllContacts');
    });

    it('should register GET /:phoneNumber', () => {
        require('../../../routes/ContactRoutes');
        expect(mockGet).toHaveBeenCalledWith('/:phoneNumber', 'mockGetAllContactsByPhoneNumber');
    });

    it('should register PUT /update/', () => {
        require('../../../routes/ContactRoutes');
        expect(mockPut).toHaveBeenCalledWith('/update/', 'mockUpdateContactByCustomFilter');
    });

    it('should register PUT /update/all/:id', () => {
        require('../../../routes/ContactRoutes');
        expect(mockPut).toHaveBeenCalledWith('/update/all/:id', 'mockUpdateAllContactsById');
    });

    it('should register POST /create', () => {
        require('../../../routes/ContactRoutes');
        expect(mockPost).toHaveBeenCalledWith('/create', 'mockCreateContact');
    });

    it('should register DELETE /delete', () => {
        require('../../../routes/ContactRoutes');
        expect(mockDelete).toHaveBeenCalledWith('/delete', 'mockDeleteContactByIds');
    });
});