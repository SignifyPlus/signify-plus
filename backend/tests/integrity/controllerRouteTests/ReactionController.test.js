const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const reactionSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getReactionService() { return reactionSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const reactionSvc = ServiceFactory.getReactionService;

describe('ReactionController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /reactions/all returns 200 and array', async () => {
        const mockReactions = [
            { _id: 'r1', type: 'like' },
            { _id: 'r2', type: 'laugh' },
        ];
        reactionSvc.getDocuments.mockResolvedValueOnce(mockReactions);

        const res = await request(app).get('/reactions/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockReactions);
        expect(reactionSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /reactions/id/:id returns reaction by id', async () => {
        const id  = 'r1';
        const doc = { _id: id, type: 'like' };
        reactionSvc.getDocumentById.mockResolvedValueOnce(doc);

        const res = await request(app).get(`/reactions/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(doc);
        expect(reactionSvc.getDocumentById).toHaveBeenCalledWith(id);
    });
});