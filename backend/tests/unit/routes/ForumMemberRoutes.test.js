const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost
    })
}));

const mockGetForumMemberController = jest.fn().mockReturnValue({
    getAllForumMembers: 'mockGetAllForumMembers',
    getForumMemberRecordsByUserId: 'mockGetForumMemberRecordsByUserId',
    getForumsByPhoneNumber: 'mockGetForumsByPhoneNumber',
    getForumMembersByForumId: 'mockGetForumMembersByForumId',
    createForumMember: 'mockCreateForumMember'
});

jest.mock('../../../factories/controllerFactory', () => ({
    getForumMemberController: mockGetForumMemberController
}));

describe('ForumMemberRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockGetForumMemberController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ForumMemberRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllForumMembers');
    });

    it('should register GET /id/:id', () => {
        require('../../../routes/ForumMemberRoutes');
        expect(mockGet).toHaveBeenCalledWith('/id/:id', 'mockGetForumMemberRecordsByUserId');
    });

    it('should register GET /:phoneNumber', () => {
        require('../../../routes/ForumMemberRoutes');
        expect(mockGet).toHaveBeenCalledWith('/:phoneNumber', 'mockGetForumsByPhoneNumber');
    });

    it('should register GET /forumId/:id', () => {
        require('../../../routes/ForumMemberRoutes');
        expect(mockGet).toHaveBeenCalledWith('/forumId/:id', 'mockGetForumMembersByForumId');
    });

    it('should register POST /create', () => {
        require('../../../routes/ForumMemberRoutes');
        expect(mockPost).toHaveBeenCalledWith('/create', 'mockCreateForumMember');
    });
});