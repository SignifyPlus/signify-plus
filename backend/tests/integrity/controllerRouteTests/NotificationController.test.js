const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const notificationSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getNotificationService() { return notificationSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const notifSvc = ServiceFactory.getNotificationService;

describe('NotificationController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /notifications/all returns 200 and full list', async () => {
        const mockData = [
            { _id: 'n1', message: 'Hello' },
            { _id: 'n2', message: 'World' },
        ];
        notifSvc.getDocuments.mockResolvedValueOnce(mockData);

        const res = await request(app).get('/notifications/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockData);
        expect(notifSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /notifications/id/:id returns the correct notification', async () => {
        const nid = 'n1';
        const doc = { _id: nid, message: 'Hello' };
        notifSvc.getDocumentById.mockResolvedValueOnce(doc);

        const res = await request(app).get(`/notifications/id/${nid}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(doc);
        expect(notifSvc.getDocumentById).toHaveBeenCalledWith(nid);
    });
});