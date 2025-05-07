const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const groupSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    };

    return {
        get getGroupService() { return groupSvc; },
        get getMongooseService() { return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory  = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const groupSvc = ServiceFactory.getGroupService;

describe('GroupController – integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /groups/all ⇒ 200 & array', async () => {
        const mockGroups = [
            { _id: 'g1', groupName: 'Integration Squad' },
            { _id: 'g2', groupName: 'Mock Masters' },
        ];
        groupSvc.getDocuments.mockResolvedValueOnce(mockGroups);

        const res = await request(app).get('/groups/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockGroups);
        expect(groupSvc.getDocuments).toHaveBeenCalled();
    });
});