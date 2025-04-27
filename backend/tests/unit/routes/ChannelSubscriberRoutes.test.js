const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

jest.mock('../../../controllers/ChannelSubscriberController', () => {
    return jest.fn().mockImplementation(() => ({
        getAllChannelSubscribers: 'mockGetAllChannelSubscribers'
    }));
});

describe('ChannelSubscriberRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all with getAllChannelSubscribers handler', () => {
        const channelSubcriberRouter = require('../../../routes/ChannelSubscriberRoutes');

        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllChannelSubscribers');
        expect(channelSubcriberRouter).toBeDefined();
        expect(typeof channelSubcriberRouter).toBe('object');
    });
});