const ChannelSubscriberController = require('../../../controllers/ChannelSubscriberController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getChannelSubscriberService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ChannelSubscriberController Unit Test', () => {
    let channelSubscriberController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        channelSubscriberController = new ChannelSubscriberController();
        reqMock = {
        params: {},
        };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllChannelSubscribers', () => {
        it('should return all channel subscribers', async () => {
            const mockChannelSubscribers = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getChannelSubscriberService.getDocuments.mockResolvedValue(mockChannelSubscribers);

            await channelSubscriberController.getAllChannelSubscribers(reqMock, resMock);

            expect(ServiceFactory.getChannelSubscriberService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockChannelSubscribers);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get channel subscribers');
            ServiceFactory.getChannelSubscriberService.getDocuments.mockRejectedValue(error);

            await channelSubscriberController.getAllChannelSubscribers(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getChannelSubscriberById', () => {
        it('should return a channel subscriber by ID', async () => {
            const mockChannelSubscriber = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getChannelSubscriberService.getDocumentById.mockResolvedValue(mockChannelSubscriber);

            await channelSubscriberController.getChannelSubscriberById(reqMock, resMock);

            expect(ServiceFactory.getChannelSubscriberService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockChannelSubscriber);
        });

        it('should handle errors and return 500 when getting by ID fails', async () => {
            const error = new Error('Failed to get channel subscriber by ID');
            reqMock.params.id = '1';
            ServiceFactory.getChannelSubscriberService.getDocumentById.mockRejectedValue(error);

            await channelSubscriberController.getChannelSubscriberById(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});