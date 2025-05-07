const ChannelSubscriberController = require('../../../controllers/ChannelSubscriberController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory');

describe('ChannelSubscriberController Integrity Test', () => {
    let controller;
    let reqMock;
    let resMock;

    beforeEach(() => {
        controller = new ChannelSubscriberController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        };
    });

    it('should return all channel subscribers', async () => {
        const mockSubscribers = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getChannelSubscriberService = {
        getDocuments: jest.fn().mockResolvedValue(mockSubscribers),
        };

        await controller.getAllChannelSubscribers(reqMock, resMock);

        expect(ServiceFactory.getChannelSubscriberService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockSubscribers);
    });

    it('should return channel subscriber by ID', async () => {
        const mockSubscriber = { id: 'abc' };
        reqMock.params.id = 'abc';
        ServiceFactory.getChannelSubscriberService = {
        getDocumentById: jest.fn().mockResolvedValue(mockSubscriber),
        };

        await controller.getChannelSubscriberById(reqMock, resMock);

        expect(ServiceFactory.getChannelSubscriberService.getDocumentById).toHaveBeenCalledWith('abc');
        expect(resMock.json).toHaveBeenCalledWith(mockSubscriber);
    });

    it('should handle error in getAllChannelSubscribers', async () => {
        const error = new Error('Service failure');
        ServiceFactory.getChannelSubscriberService = {
        getDocuments: jest.fn().mockRejectedValue(error),
        };

        await controller.getAllChannelSubscribers(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle error in getChannelSubscriberById', async () => {
        const error = new Error('Lookup failure');
        reqMock.params.id = 'xyz';
        ServiceFactory.getChannelSubscriberService = {
        getDocumentById: jest.fn().mockRejectedValue(error),
        };

        await controller.getChannelSubscriberById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
    });
});