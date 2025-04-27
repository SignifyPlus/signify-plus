const NotificationController = require('../../../controllers/NotificationController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getNotificationService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('NotificationController Unit Test', () => {
    let notificationController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        notificationController = new NotificationController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllNotifications', () => {
        it('should return all notifications', async () => {
        const mockNotifications = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getNotificationService.getDocuments.mockResolvedValue(mockNotifications);

        await notificationController.getAllNotifications(reqMock, resMock);

        expect(ServiceFactory.getNotificationService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockNotifications);
        });

        it('should handle errors and return 500', async () => {
        const error = new Error('Failed to fetch notifications');
        ServiceFactory.getNotificationService.getDocuments.mockRejectedValue(error);

        await notificationController.getAllNotifications(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getNotificationById', () => {
        it('should return a notification by ID', async () => {
        const mockNotification = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getNotificationService.getDocumentById.mockResolvedValue(mockNotification);

        await notificationController.getNotificationById(reqMock, resMock);

        expect(ServiceFactory.getNotificationService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockNotification);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
        const error = new Error('Failed to fetch notification');
        reqMock.params.id = '1';
        ServiceFactory.getNotificationService.getDocumentById.mockRejectedValue(error);

        await notificationController.getNotificationById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});