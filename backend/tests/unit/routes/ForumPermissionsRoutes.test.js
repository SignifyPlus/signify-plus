const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

jest.mock('../../../controllers/ForumPermissionsController', () => {
    return jest.fn().mockImplementation(() => ({
        getAllForumPermissionss: 'mockGetAllForumPermissionss'
    }));
});

describe('ForumPermissionsRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all with getAllForumPermissionss handler', () => {
        const forumPermissionsRouter = require('../../../routes/ForumPermissionsRoutes');

        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllForumPermissionss');
        expect(forumPermissionsRouter).toBeDefined();
        expect(typeof forumPermissionsRouter).toBe('object');
    });
});