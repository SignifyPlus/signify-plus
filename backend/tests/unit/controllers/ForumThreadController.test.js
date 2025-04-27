const ForumThreadController = require('../../../controllers/ForumThreadController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getForumThreadService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ForumThreadController Unit Test', () => {
    let forumThreadController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        forumThreadController = new ForumThreadController();
        reqMock = { params: {} };
        resMock = {
            json: jest.fn(),
            status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllForumThreads', () => {
        it('should return all forum threads', async () => {
            const mockThreads = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getForumThreadService.getDocuments.mockResolvedValue(mockThreads);

            await forumThreadController.getAllForumThreads(reqMock, resMock);

            expect(ServiceFactory.getForumThreadService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockThreads);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get forum threads');
            ServiceFactory.getForumThreadService.getDocuments.mockRejectedValue(error);

            await forumThreadController.getAllForumThreads(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getForumThreadById', () => {
        it('should return a forum thread by ID', async () => {
            const mockThread = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getForumThreadService.getDocumentById.mockResolvedValue(mockThread);

            await forumThreadController.getForumThreadById(reqMock, resMock);

            expect(ServiceFactory.getForumThreadService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockThread);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
            const error = new Error('Failed to get forum thread by ID');
            reqMock.params.id = '1';
            ServiceFactory.getForumThreadService.getDocumentById.mockRejectedValue(error);

            await forumThreadController.getForumThreadById(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
