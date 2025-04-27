const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllNotifications = 'mockGetAllNotifications';

const mockNotificationController = jest.fn().mockImplementation(() => ({
    getAllNotifications: mockGetAllNotifications,
}));

jest.mock('../../../controllers/NotificationController.js', () => mockNotificationController);

describe('NotificationRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockNotificationController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/NotificationRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllNotifications);
    });
});