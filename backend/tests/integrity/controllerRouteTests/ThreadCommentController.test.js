const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const threadCommentSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getThreadCommentService() { return threadCommentSvc; },
    };
});

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');
const threadCommentSvc = ServiceFactory.getThreadCommentService;

describe('ThreadCommentController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /threadComments/all returns 200 and array', async () => {
        const mockComments = [
            { _id: 'tc1', content: 'First comment' },
            { _id: 'tc2', content: 'Second comment' },
        ];
        threadCommentSvc.getDocuments.mockResolvedValueOnce(mockComments);

        const res = await request(app).get('/threadComments/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockComments);
        expect(threadCommentSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /threadComments/id/:id returns the comment by id', async () => {
        const id = 'tc1';
        const mockComment = { _id: id, content: 'First comment' };
        threadCommentSvc.getDocumentById.mockResolvedValueOnce(mockComment);

        const res = await request(app).get(`/threadComments/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockComment);
        expect(threadCommentSvc.getDocumentById).toHaveBeenCalledWith(id);
    });
});