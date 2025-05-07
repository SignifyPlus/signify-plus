const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const threadSvc = {
        getDocuments: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction:jest.fn(),
    };
    return {
        get getThreadService()    { return threadSvc; },
        get getMongooseService() { return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

describe('ThreadController integrity routes', () => {
    const threadSvc = ServiceFactory.getThreadService;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /threads/all returns 200 and an array of threads', async () => {
        const mockThreads = [
            { _id: 't1', title: 'Thread 1' },
            { _id: 't2', title: 'Thread 2' },
        ];
        threadSvc.getDocuments.mockResolvedValueOnce(mockThreads);

        const res = await request(app).get('/threads/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(mockThreads);
        expect(threadSvc.getDocuments).toHaveBeenCalled();
    });
});