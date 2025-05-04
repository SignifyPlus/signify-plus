/* Integrity tests for ForumController.
  We mock only external infrastructure. 
  Core controller logic and route wiring are exercised against the Express app.*/
const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
  const userSvc = {
    getDocumentByCustomFilters: jest.fn(),
  };
  const forumSvc = {
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    saveDocument: jest.fn(),
  };
  const forumMemberSvc = {
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

describe('ForumController – integrity routes (with dependency mocks)', () => {

  const userSvc = ServiceFactory.getUserService;
  const forumSvc = ServiceFactory.getForumService;
  const forumMemberSvc = ServiceFactory.getForumMemberService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /forums/all ⇒ 200 & array', async () => {
    forumSvc.getDocuments.mockResolvedValueOnce([
      { _id: 'f1', forumName: 'ForumOne' },
      { _id: 'f2', forumName: 'ForumTwo' },
    ]);

    const res = await request(app).get('/forums/all');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('forumName', 'ForumOne');
    expect(forumSvc.getDocuments).toHaveBeenCalledWith(expect.anything());
  });

  it('GET /forums/id/:id ⇒ returns the correct forum', async () => {
    forumSvc.getDocuments.mockResolvedValueOnce([
      { _id: 'f1', forumName: 'ForumOne' },
    ]);
    forumSvc.getDocumentById.mockResolvedValueOnce({ _id: 'f1', forumName: 'ForumOne' });

    const listRes = await request(app).get('/forums/all');
    const { _id } = listRes.body[0];

    const res = await request(app).get(`/forums/id/${_id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('forumName', 'ForumOne');
    expect(forumSvc.getDocumentById).toHaveBeenCalledWith(_id, expect.anything());
  });

  it('POST /forums/create ⇒ 400 when forumName missing', async () => {
    const res = await request(app)
      .post('/forums/create')
      .send({ createdBy: '+1234567890' });

    expect(res.status).toBe(400);
    expect(res.body.Message).toMatch(/forumName is not provided/i);
  });

  it('POST /forums/create ⇒ 400 when createdBy missing', async () => {
    const res = await request(app)
      .post('/forums/create')
      .send({ forumName: 'New Forum' });

    expect(res.status).toBe(400);
    expect(res.body.Message).toMatch(/createdBy is not provided/i);
  });

  it('POST /forums/create ⇒ 400 when user does not exist', async () => {
    userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/forums/create')
      .send({ forumName: 'Forum X', createdBy: '+9999999999' });

    expect(res.status).toBe(400);
    expect(res.body.Message).toMatch(/doesnt exist in the user table/i);
  });

  it('POST /forums/create ⇒ 200 & returns forum + member', async () => {
    const mockUser        = { _id: 'u1' };
    const mockForum       = [{ _id: 'f1', forumName: 'Brand‑New', forumDescription: 'Test' }];
    const mockForumMember = { _id: 'm1', userId: 'u1', forumId: 'f1', isOwner: true };

    userSvc.getDocumentByCustomFilters.mockResolvedValueOnce(mockUser);
    forumSvc.saveDocument.mockResolvedValueOnce(mockForum);
    forumMemberSvc.saveDocument.mockResolvedValueOnce(mockForumMember);

    const res = await request(app)
      .post('/forums/create')
      .send({ forumName: 'Brand‑New', createdBy: '+1234567890' });

    expect(res.status).toBe(200);
    expect(res.body.forum).toEqual(mockForum);
    expect(res.body.forumMember).toEqual(mockForumMember);
  });
});
