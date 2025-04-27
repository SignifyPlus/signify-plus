const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllThreadComments = 'mockGetAllThreadComments';

const mockThreadCommentController = jest.fn().mockImplementation(() => ({
    getAllThreadComments: mockGetAllThreadComments,
}));

jest.mock('../../../controllers/ThreadCommentController.js', () => mockThreadCommentController);

describe('ThreadCommentRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockThreadCommentController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ThreadCommentRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllThreadComments);
    });
});