const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const forumThreadSvc = {
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
        get getForumThreadService() { return forumThreadSvc; },
        get getMongooseService() { return mongooseSvc;   },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const threadSvc = ServiceFactory.getForumThreadService;

describe('ForumThreadController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /forumThreads/all ⇒ 200 & array', async () => {
        const mockThreads = [
            { _id: 't1', title: 'First thread' },
            { _id: 't2', title: 'Second thread' },
        ];
        threadSvc.getDocuments.mockResolvedValueOnce(mockThreads);

        const res = await request(app).get('/forumThreads/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockThreads);
        expect(threadSvc.getDocuments).toHaveBeenCalled();
    });
});