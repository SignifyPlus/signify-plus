const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const settingsSvc = {
        getDocumentById: mockId => Promise.resolve({ _id: mockId, aslTranslationLanguage: 'EN' }),
        getDocumentsByCustomFiltersQuery: jest.fn(),
        saveDocument: Promise.resolve.bind(Promise),
    };
    const userSvc = {
        getDocumentByCustomFilters: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction:jest.fn(),
    };
    return {
        get getSettingsService() { return settingsSvc; },
        get getUserService() { return userSvc; },
        get getMongooseService() { return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const settingsSvc = ServiceFactory.getSettingsService;
const userSvc = ServiceFactory.getUserService;

describe('SettingsController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /settings/id/:id returns 200 and a setting', async () => {
        const id = 's1';
        settingsSvc.getDocumentById = jest.fn().mockResolvedValueOnce({ _id: id, aslTranslationLanguage: 'EN' });

        const res = await request(app).get(`/settings/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(id);
        expect(settingsSvc.getDocumentById).toHaveBeenCalledWith(id, expect.anything());
    });

    it('GET /settings/:phoneNumber returns 200 and array', async () => {
        const phone = '+905551112233';
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValueOnce([{ _id: 's2', userId: { _id: 'u1' } }]),
        };
        settingsSvc.getDocumentsByCustomFiltersQuery.mockReturnValueOnce(mockQuery);

        const res = await request(app).get(`/settings/${encodeURIComponent(phone)}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]._id).toBe('s2');
        expect(settingsSvc.getDocumentsByCustomFiltersQuery)
        .toHaveBeenCalledWith({ userId: 'u1' }, expect.anything());
    });

    it('POST /settings/default/create returns 200 and new settings', async () => {
        const userId = 'u2';
        settingsSvc.saveDocument = jest.fn().mockResolvedValueOnce({ _id: 's3', userId });

        const res = await request(app)
        .post('/settings/default/create')
        .send({ userId });
        expect(res.status).toBe(200);
        expect(res.body._id).toBe('s3');
        expect(settingsSvc.saveDocument).toHaveBeenCalledWith({ userId }, expect.anything());
    });
});