const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllUserActivities = 'mockGetAllUserActivities';

jest.mock('../../../factories/controllerFactory.js', () => ({
    getUserActivitiyController: () => ({
        getAllUserActivities: mockGetAllUserActivities,
    }),
}));

describe('UserActivityRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/UserActivityRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllUserActivities);
    });
});