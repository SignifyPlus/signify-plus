const ChannelController = require('../../../controllers/ChannelController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getChannelService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ChannelController Unit Test', () => {
    let channelController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        channelController = new ChannelController();
        reqMock = {
        params: {},
        };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllChannels', () => {
        it('should return all channels', async () => {
            const mockChannels = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getChannelService.getDocuments.mockResolvedValue(mockChannels);

            await channelController.getAllChannels(reqMock, resMock);

            expect(ServiceFactory.getChannelService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockChannels);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get channels');
            ServiceFactory.getChannelService.getDocuments.mockRejectedValue(error);

            await channelController.getAllChannels(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getChannelById', () => {
        it('should return channel by ID', async () => {
            const mockChannel = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getChannelService.getDocumentById.mockResolvedValue(mockChannel);

            await channelController.getChannelById(reqMock, resMock);

            expect(ServiceFactory.getChannelService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockChannel);
        });

        it('should handle errors and return 500 when getting by ID fails', async () => {
            const error = new Error('Failed to get channel by ID');
            reqMock.params.id = '1';
            ServiceFactory.getChannelService.getDocumentById.mockRejectedValue(error);

            await channelController.getChannelById(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});