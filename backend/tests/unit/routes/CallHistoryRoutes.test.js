const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

jest.mock('../../../controllers/CallHistoryController', () => {
    return jest.fn().mockImplementation(() => ({
        getCallHistory: 'mockGetCallHistory'
    }));
});

describe('CallHistoryRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route with getCallHistory handler', () => {
        const callHistoryRouter = require('../../../routes/CallHistoryRoutes');

        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetCallHistory');
        expect(callHistoryRouter).toBeDefined();
        expect(typeof callHistoryRouter).toBe('object');
    });
});