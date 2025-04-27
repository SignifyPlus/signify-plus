const ThreadController = require('../../../controllers/ThreadController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getThreadService: {
        getDocuments: jest.fn(),
    },
}));

describe('ThreadController Unit Test', () => {
    let threadController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        threadController = new ThreadController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllThreads', () => {
        it('should return all threads', async () => {
        const mockThreads = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getThreadService.getDocuments.mockResolvedValue(mockThreads);

        await threadController.getAllThreads(reqMock, resMock);

        expect(ServiceFactory.getThreadService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockThreads);
        });

        it('should handle errors and return 500', async () => {
        const error = new Error('Failed to fetch threads');
        ServiceFactory.getThreadService.getDocuments.mockRejectedValue(error);

        await threadController.getAllThreads(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});