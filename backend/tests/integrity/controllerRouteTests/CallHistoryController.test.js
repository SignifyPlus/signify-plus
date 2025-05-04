const CallHistoryController = require('../../../controllers/CallHistoryController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory');

describe('CallHistoryController Integrity Test', () => {
    let controller;
    let reqMock;
    let resMock;

    beforeEach(() => {
        controller = new CallHistoryController();
        reqMock = {
        params: {},
        };
        resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        };
    });

    it('should return all call histories', async () => {
        const mockData = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getCallHistoryService = {
        getDocuments: jest.fn().mockResolvedValue(mockData),
        };

        await controller.getCallHistory(reqMock, resMock);

        expect(ServiceFactory.getCallHistoryService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockData);
    });

    it('should return call history by user ID', async () => {
        const mockHistory = { id: '1', user: '123' };
        reqMock.params.id = '123';
        ServiceFactory.getCallHistoryService = {
        getDocumentById: jest.fn().mockResolvedValue(mockHistory),
        };

        await controller.getCallHistoryByUserId(reqMock, resMock);

        expect(ServiceFactory.getCallHistoryService.getDocumentById).toHaveBeenCalledWith('123');
        expect(resMock.json).toHaveBeenCalledWith(mockHistory);
    });

    it('should handle error in getCallHistory', async () => {
        const error = new Error('Failed to fetch');
        ServiceFactory.getCallHistoryService = {
        getDocuments: jest.fn().mockRejectedValue(error),
        };

        await controller.getCallHistory(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle error in getCallHistoryByUserId', async () => {
        const error = new Error('Database error');
        reqMock.params.id = '456';
        ServiceFactory.getCallHistoryService = {
        getDocumentById: jest.fn().mockRejectedValue(error),
        };

        await controller.getCallHistoryByUserId(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });
});