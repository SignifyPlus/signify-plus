const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

describe('HomeRoute Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /', () => {
        require('../../../routes/HomeRoute');
        expect(mockGet).toHaveBeenCalledWith('/', expect.any(Function));
    });
});