const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const groupMemberSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getGroupMemberService() { return groupMemberSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const memberSvc = ServiceFactory.getGroupMemberService;

describe('GroupMemberController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /groupMembers/all returns 200 and an array', async () => {
        const mockMembers = [
            { _id: 'gm1', userId: 'u1', groupId: 'g1' },
            { _id: 'gm2', userId: 'u2', groupId: 'g1' },
        ];
        memberSvc.getDocuments.mockResolvedValueOnce(mockMembers);

        const res = await request(app).get('/groupMembers/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockMembers);
        expect(memberSvc.getDocuments).toHaveBeenCalled();
    });
});