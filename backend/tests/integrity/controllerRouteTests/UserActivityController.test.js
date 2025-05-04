const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const userActivitySvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getUserActivityService() { return userActivitySvc; },
    };
});

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const userActivitySvc = ServiceFactory.getUserActivityService;

describe('UserActivityController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /userActivities/all returns 200 and an array', async () => {
        const mockActivities = [
            { _id: 'ua1', activity: 'login' },
            { _id: 'ua2', activity: 'logout' },
        ];
        userActivitySvc.getDocuments.mockResolvedValueOnce(mockActivities);

        const res = await request(app).get('/userActivities/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(mockActivities);
        expect(userActivitySvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /userActivities/id/:id returns the correct user activity', async () => {
        const id       = 'ua1';
        const mockItem = { _id: id, activity: 'login' };
        userActivitySvc.getDocumentById.mockResolvedValueOnce(mockItem);

        const res = await request(app).get(`/userActivities/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockItem);
        expect(userActivitySvc.getDocumentById).toHaveBeenCalledWith(id);
    });
});
