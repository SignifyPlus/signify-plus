const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

jest.mock('../../../controllers/ChannelController', () => {
    return jest.fn().mockImplementation(() => ({
        getAllChannels: 'mockGetAllChannels'
    }));
});

describe('ChannelRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route with getAllChannels handler', () => {
        const channelRouter = require('../../../routes/ChannelRoutes');

        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllChannels');
        expect(channelRouter).toBeDefined();
        expect(typeof channelRouter).toBe('object');
    });
});