const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const mediaSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getMediaService() { return mediaSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const mediaSvc = ServiceFactory.getMediaService;

describe('MediaController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /media/all returns 200 and array', async () => {
        const mockMedia = [
            { _id: 'm1', name: 'image.png' },
            { _id: 'm2', name: 'video.mp4' },
        ];
        mediaSvc.getDocuments.mockResolvedValueOnce(mockMedia);

        const res = await request(app).get('/media/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockMedia);
        expect(mediaSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /media/id/:id returns media by id', async () => {
        const id = 'm1';
        const doc = { _id: id, name: 'image.png' };
        mediaSvc.getDocumentById.mockResolvedValueOnce(doc);

        const res = await request(app).get(`/media/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(doc);
        expect(mediaSvc.getDocumentById).toHaveBeenCalledWith(id);
    });
});