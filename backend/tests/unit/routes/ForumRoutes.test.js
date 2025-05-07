const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost
    })
}));

const mockGetForumController = jest.fn().mockReturnValue({
    getAllForums: 'mockGetAllForums',
    getForumById: 'mockGetForumById',
    createForum: 'mockCreateForum'
});

jest.mock('../../../factories/controllerFactory', () => ({
    getForumController: mockGetForumController
}));

describe('ForumRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockGetForumController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ForumRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllForums');
    });

    it('should register GET /id/:id', () => {
        require('../../../routes/ForumRoutes');
        expect(mockGet).toHaveBeenCalledWith('/id/:id', 'mockGetForumById');
    });

    it('should register POST /create', () => {
        require('../../../routes/ForumRoutes');
        expect(mockPost).toHaveBeenCalledWith('/create', 'mockCreateForum');
    });
});