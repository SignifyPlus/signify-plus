const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const userSvc = { getDocumentByCustomFilters: jest.fn() };
    return { get getUserService() { return userSvc; } };
});
jest.mock('../../../factories/managerFactory', () => {
    const jwtMgr = { verifyRefreshToken: jest.fn() };
    return { getJwtManager: () => jwtMgr };
});
jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const userSvc = ServiceFactory.getUserService;
const jwtMgr  = require('../../../factories/managerFactory').getJwtManager();

describe('JwtController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('POST /jwt/validate returns 400 when phoneNumber missing', async () => {
        const res = await request(app)
        .post('/jwt/validate')
        .send({ refreshToken: 'abc' });
        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/phoneNumber is required/i);
    });

    it('POST /jwt/validate returns 400 when refreshToken missing', async () => {
        const res = await request(app)
        .post('/jwt/validate')
        .send({ phoneNumber: '+905551112233' });
        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/refreshToken is required/i);
    });

    it('POST /jwt/validate returns 400 when user not found', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(null);

        const res = await request(app)
        .post('/jwt/validate')
        .send({ phoneNumber: '+905551112233', refreshToken: 'abc' });

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/User does not exist/i);
    });

    it('POST /jwt/validate returns 401 when token invalid', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
        jwtMgr.verifyRefreshToken.mockResolvedValueOnce({ exception: new Error('bad') });

        const res = await request(app)
        .post('/jwt/validate')
        .send({ phoneNumber: '+905551112233', refreshToken: 'badToken' });

        expect(res.status).toBe(401);
        expect(res.body.Message).toMatch(/Token expired or it is invalid/i);
    });

    it('POST /jwt/validate returns 200 when token valid', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
        jwtMgr.verifyRefreshToken.mockResolvedValueOnce({ data: { userId: 'u1' } });

        const res = await request(app)
        .post('/jwt/validate')
        .send({ phoneNumber: '+905551112233', refreshToken: 'goodToken' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ isValid: true, details: { userId: 'u1' } });
    });
});