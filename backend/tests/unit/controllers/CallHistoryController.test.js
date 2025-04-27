const CallHistoryController = require('../../../controllers/CallHistoryController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getCallHistoryService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('CallHistoryController Unit Test', () => {
    let callHistoryController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        callHistoryController = new CallHistoryController();

        reqMock = {
            params: {},
        };

        resMock = {
            json: jest.fn(),
            status: jest.fn(() => resMock),
        };

        jest.clearAllMocks();
    });

    describe('getCallHistory', () => {
        it('should return all call histories', async () => {
            const mockCallHistories = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getCallHistoryService.getDocuments.mockResolvedValue(mockCallHistories);

            await callHistoryController.getCallHistory(reqMock, resMock);

            expect(ServiceFactory.getCallHistoryService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockCallHistories);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get call histories');
            ServiceFactory.getCallHistoryService.getDocuments.mockRejectedValue(error);

            await callHistoryController.getCallHistory(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getCallHistoryByUserId', () => {
        it('should return call history by user ID', async () => {
            const mockCallHistory = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getCallHistoryService.getDocumentById.mockResolvedValue(mockCallHistory);

            await callHistoryController.getCallHistoryByUserId(reqMock, resMock);

            expect(ServiceFactory.getCallHistoryService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockCallHistory);
        });

        it('should handle errors and return 500 when getting by ID fails', async () => {
            const error = new Error('Failed to get call history by ID');
            reqMock.params.id = '1';
            ServiceFactory.getCallHistoryService.getDocumentById.mockRejectedValue(error);

            await callHistoryController.getCallHistoryByUserId(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});