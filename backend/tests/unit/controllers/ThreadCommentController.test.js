const ThreadCommentController = require('../../../controllers/ThreadCommentController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getThreadCommentService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ThreadCommentController Unit Test', () => {
    let threadCommentController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        threadCommentController = new ThreadCommentController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllThreadComments', () => {
        it('should return all thread comments', async () => {
        const mockThreadComments = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getThreadCommentService.getDocuments.mockResolvedValue(mockThreadComments);

        await threadCommentController.getAllThreadComments(reqMock, resMock);

        expect(ServiceFactory.getThreadCommentService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockThreadComments);
        });

        it('should handle errors and return 500 when fetching all thread comments fails', async () => {
        const error = new Error('Failed to fetch thread comments');
        ServiceFactory.getThreadCommentService.getDocuments.mockRejectedValue(error);

        await threadCommentController.getAllThreadComments(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getThreadCommentById', () => {
        it('should return a thread comment by ID', async () => {
        const mockThreadComment = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getThreadCommentService.getDocumentById.mockResolvedValue(mockThreadComment);

        await threadCommentController.getThreadCommentById(reqMock, resMock);

        expect(ServiceFactory.getThreadCommentService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockThreadComment);
        });

        it('should handle errors and return 500 when fetching thread comment by ID fails', async () => {
        const error = new Error('Failed to fetch thread comment by ID');
        reqMock.params.id = '1';
        ServiceFactory.getThreadCommentService.getDocumentById.mockRejectedValue(error);

        await threadCommentController.getThreadCommentById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});