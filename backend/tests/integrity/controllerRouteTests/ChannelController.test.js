const ChannelController = require('../../../controllers/ChannelController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory');

describe('ChannelController Integrity Test', () => {
    let controller;
    let reqMock;
    let resMock;

    beforeEach(() => {
        controller = new ChannelController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        };
    });

    it('should return all channels', async () => {
        const mockChannels = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getChannelService = {
        getDocuments: jest.fn().mockResolvedValue(mockChannels),
        };

        await controller.getAllChannels(reqMock, resMock);

        expect(ServiceFactory.getChannelService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockChannels);
    });

    it('should return single channel by ID', async () => {
        const mockChannel = { id: '123', name: 'Channel 1' };
        reqMock.params.id = '123';
        ServiceFactory.getChannelService = {
        getDocumentById: jest.fn().mockResolvedValue(mockChannel),
        };

        await controller.getChannelById(reqMock, resMock);

        expect(ServiceFactory.getChannelService.getDocumentById).toHaveBeenCalledWith('123');
        expect(resMock.json).toHaveBeenCalledWith(mockChannel);
    });

    it('should handle error in getAllChannels', async () => {
        const error = new Error('Failed to get channels');
        ServiceFactory.getChannelService = {
        getDocuments: jest.fn().mockRejectedValue(error),
        };

        await controller.getAllChannels(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle error in getChannelById', async () => {
        const error = new Error('DB error');
        reqMock.params.id = '123';
        ServiceFactory.getChannelService = {
        getDocumentById: jest.fn().mockRejectedValue(error),
        };

        await controller.getChannelById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });
});