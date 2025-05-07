const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

const mockGetCommentController = jest.fn().mockReturnValue({
    getAllComments: 'mockGetAllComments'
});

jest.mock('../../../factories/controllerFactory', () => ({
    getCommentController: mockGetCommentController
}));

describe('CommentRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockGetCommentController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route with getAllComments handler', () => {
        const commentRouter = require('../../../routes/CommentRoutes');

        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllComments');
        expect(commentRouter).toBeDefined();
        expect(typeof commentRouter).toBe('object');
    });
});