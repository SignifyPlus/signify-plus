const CommentController = require('../../../controllers/CommentController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getCommentService: {
        getDocuments: jest.fn(),
    },
}));

describe('CommentController Unit Test', () => {
    let commentController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        commentController = new CommentController();
        reqMock = {};
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllComments', () => {
        it('should return all comments', async () => {
            const mockComments = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getCommentService.getDocuments.mockResolvedValue(mockComments);

            await commentController.getAllComments(reqMock, resMock);

            expect(ServiceFactory.getCommentService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockComments);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get comments');
            ServiceFactory.getCommentService.getDocuments.mockRejectedValue(error);

            await commentController.getAllComments(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});