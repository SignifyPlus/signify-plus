const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const forumPermissionsSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction:jest.fn(),
    };

    return {
        get getForumPermissionsService() { return forumPermissionsSvc; },
        get getMongooseService() { return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const forumPermissionsSvc = ServiceFactory.getForumPermissionsService;

describe('ForumPermissionsController – integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /forumPermissions/all ⇒ 200 & array', async () => {
        const mockData = [
            { _id: 'p1', permission: 'CAN_POST' },
            { _id: 'p2', permission: 'CAN_DELETE' },
        ];
        forumPermissionsSvc.getDocuments.mockResolvedValueOnce(mockData);

        const res = await request(app).get('/forumPermissions/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockData);
        expect(forumPermissionsSvc.getDocuments).toHaveBeenCalled();
    });
});