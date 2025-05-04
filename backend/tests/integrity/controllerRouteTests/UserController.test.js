const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const userSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
        getDocumentByCustomFilters: jest.fn(),
    };
    const userAuthSvc = {
        getDocumentByCustomFilters: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: async () => ({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    };
    return {
        get getUserService() { return userSvc; },
        get getUserAuthenticationService(){ return userAuthSvc; },
        get getMongooseService(){ return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const userSvc = ServiceFactory.getUserService;
const userAuthSvc = ServiceFactory.getUserAuthenticationService;

describe('UserController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /users/all returns 200 and array', async () => {
        const mockUsers = [
            { _id: 'u1', name: 'Alice' },
            { _id: 'u2', name: 'Bob' },
        ];
        userSvc.getDocuments.mockResolvedValueOnce(mockUsers);

        const res = await request(app).get('/users/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
        expect(userSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /users/:id returns the user by id', async () => {
        const id = 'u1';
        const mockUser = { _id: id, name: 'Alice' };
        userSvc.getDocumentById.mockResolvedValueOnce(mockUser);

        const res = await request(app).get(`/users/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
        expect(userSvc.getDocumentById).toHaveBeenCalledWith(id);
    });

    it('GET /users/phone/:phoneNumber returns the user when exists', async () => {
        const phone = '+901234567890';
        const mockUserData = { _id: 'u1', phoneNumber: phone };
        const mockUser = {
            ...mockUserData,
            toObject: () => mockUserData
        };
        const mockAuth = { token: 'xyz' };
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(mockUser);
        userAuthSvc.getDocumentByCustomFilters.mockResolvedValueOnce(mockAuth);

        const res = await request(app).get(`/users/phone/${encodeURIComponent(phone)}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
        _id: mockUser._id,
        phoneNumber: phone,
        authenticationData: mockAuth,
        });
        expect(userSvc.getDocumentByCustomFilters).toHaveBeenCalledWith({ phoneNumber: phone });
        expect(userAuthSvc.getDocumentByCustomFilters).toHaveBeenCalledWith({ userId: mockUser._id.toString() });
    });

    it('GET /users/phone/:phoneNumber returns 400 when user not found', async () => {
        const phone = '+905555555555';
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(null);

        const res = await request(app).get(`/users/phone/${encodeURIComponent(phone)}`);
        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/User does not exist in the database/i);
    });
});