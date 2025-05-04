const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const userSvc = { getDocumentByCustomFilters: jest.fn() };
    const forumSvc = { getDocumentByCustomFilters: jest.fn() };
    const forumMemberSvc = {
        getDocumentsQuery: jest.fn(),
        getDocumentsByCustomFiltersQuery:jest.fn(),
        saveDocument: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction:jest.fn(),
    };
    return {
        get getUserService() { return userSvc; },
        get getForumService() { return forumSvc; },
        get getForumMemberService() { return forumMemberSvc; },
        get getMongooseService() { return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const userSvc = ServiceFactory.getUserService;
const forumSvc = ServiceFactory.getForumService;
const forumMemberSvc = ServiceFactory.getForumMemberService;

describe('ForumMemberController – integrity routes (with mocks)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /forumMembers/all ⇒ 200 & populated array', async () => {
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValueOnce([
                { _id: 'm1', forumId: { forumName: 'MockingBirds' }, userId: { name: 'Bora' } },
            ]),
        };
        forumMemberSvc.getDocumentsQuery.mockReturnValueOnce(mockQuery);

        const res = await request(app).get('/forumMembers/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('forumId.forumName', 'MockingBirds');
        expect(forumMemberSvc.getDocumentsQuery).toHaveBeenCalledWith(expect.anything());
    });

    it('GET /forumMembers/id/:id ⇒ returns records by userId', async () => {
        const uid = 'u1';
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValueOnce([{ userId: { _id: uid, name: 'Bora' } }]),
        };
        forumMemberSvc.getDocumentsByCustomFiltersQuery.mockReturnValueOnce(mockQuery);

        const res = await request(app).get(`/forumMembers/id/${uid}`);
        expect(res.status).toBe(200);
        expect(res.body[0].userId._id).toBe(uid);
        expect(forumMemberSvc.getDocumentsByCustomFiltersQuery)
        .toHaveBeenCalledWith({ userId: uid }, expect.anything());
    });

    it('GET /forumMembers/forumId/:id ⇒ returns members by forumId', async () => {
        const fid = 'f1';
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValueOnce([{ forumId: { _id: fid } }]),
        };
        forumMemberSvc.getDocumentsByCustomFiltersQuery.mockReturnValueOnce(mockQuery);

        const res = await request(app).get(`/forumMembers/forumId/${fid}`);
        expect(res.status).toBe(200);
        expect(res.body[0].forumId._id).toBe(fid);
    });

    it('POST /forumMembers/create ⇒ 400 when forumId missing', async () => {
        const res = await request(app)
        .post('/forumMembers/create')
        .send({ forumJoinee: '+905551112233' });

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/forumId is not provided/i);
    });

    it('POST /forumMembers/create ⇒ 400 when forumJoinee missing', async () => {
        const res = await request(app)
        .post('/forumMembers/create')
        .send({ forumId: 'f1' });

        expect(res.status).toBe(400);
        expect(res.body.Message).toMatch(/forumJoinee is not provided/i);
    });

    it('POST /forumMembers/create ⇒ 200 & returns new forum-member', async () => {
        const mockUser  = { _id: 'u1' };
        const mockForum = { _id: 'f1' };
        const mockMember= { _id: 'm1', userId: 'u1', forumId: 'f1', isOwner: false };

        userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(mockUser);
        forumSvc.getDocumentByCustomFilters.mockResolvedValueOnce(mockForum);
        forumMemberSvc.saveDocument.mockResolvedValueOnce(mockMember);

        const res = await request(app)
        .post('/forumMembers/create')
        .send({ forumId: 'f1', forumJoinee: '+905551112233' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockMember);
    });
});