const request = require('supertest');
const app = require('../../../tests/security/expressApp');
const ContactController = require('../../../controllers/ContactController');

jest.mock('../../../factories/serviceFactory');

const ServiceFactory = require('../../../factories/serviceFactory');

describe('ContactController Integrity Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const mockContactService = {
            getDocuments: jest.fn(),
            getDocumentsByCustomFiltersQuery: jest.fn(),
            updateDocument: jest.fn(),
            deleteDocument: jest.fn(),
            getDocument: jest.fn(),
            saveDocuments: jest.fn(),
            deleteDocuments: jest.fn(),
        };

        const mockUserService = {
            getDocumentByCustomFilters: jest.fn(),
            getDocumentsByCustomFilters: jest.fn(),
        };

        ServiceFactory.getContactService = mockContactService;
        ServiceFactory.getUserService = mockUserService;
    });

    it('GET /contacts should return all contacts', async () => {
        const mockContacts = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getContactService.getDocuments.mockResolvedValueOnce(mockContacts);
    
        const res = await request(app).get('/contacts/all');
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockContacts);
    });

    it('GET /contacts/phone/:phoneNumber should validate phone param', async () => {
        const res = await request(app).get('/contacts/');
        expect(res.status).toBe(404);
    });

    it('PUT /contacts/update should return 400 if missing filters or fields', async () => {
        const res = await request(app)
        .put('/contacts/update')
        .send({});

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/Filters and FieldsToUpdate/);
    });

    it('POST /contacts/create should return 400 if missing userPhoneNumber or contacts', async () => {
        const res = await request(app)
        .post('/contacts/create')
        .send({});

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/userPhoneNumber and contacts/);
    });

    it('DELETE /contacts/delete should return 400 if userId or targetUserId is missing', async () => {
        const res = await request(app)
        .delete('/contacts/delete')
        .send({});

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/targetUserId and userId/);
    });

    it('GET /contacts/:phoneNumber should return contacts for a valid phone number', async () => {
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'user123' });

        const mockContacts = [{ id: 'c1' }, { id: 'c2' }];
        ServiceFactory.getContactService.getDocumentsByCustomFiltersQuery.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValueOnce(mockContacts),
        });

        const res = await request(app).get('/contacts/+90123456');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockContacts);
    });

    it('PUT /contacts/update/all/:id should return 400 if id or fields are missing', async () => {
        const res = await request(app).put('/contacts/update/all/null').send({});
        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/Id and FieldsToUpdate/);
    });

    it('PUT /contacts/update/all/:id should update multiple contacts when valid', async () => {
        ServiceFactory.getContactService.updateDocument.mockResolvedValueOnce({ id: 'c1' });
        ServiceFactory.getContactService.updateDocument.mockResolvedValueOnce({ id: 'c2' });

        const res = await request(app)
            .put('/contacts/update/all/abc123')
            .send({ fieldsToUpdate: [{ name: 'X' }, { name: 'Y' }] });

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('DELETE /contacts/delete should delete and return contact on valid input', async () => {
        ServiceFactory.getContactService.deleteDocument.mockResolvedValueOnce({ id: 'deleted' });

        const res = await request(app)
            .delete('/contacts/delete')
            .send({ userId: 'user1', targetUserId: 'user2' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 'deleted' });
    });
});