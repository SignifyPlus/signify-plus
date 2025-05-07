const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

const mockGetAllForumThreads = 'mockGetAllForumThreads';

const MockForumThreadController = jest.fn().mockImplementation(() => ({
    getAllForumThreads: mockGetAllForumThreads
}));

jest.mock('../../../controllers/ForumThreadController.js', () => MockForumThreadController);

describe('ForumThreadRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        MockForumThreadController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route', () => {
        require('../../../routes/ForumThreadRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllForumThreads);
    });
});