const UserActivityController = require('../../../controllers/UserActivityController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getUserActivityService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('UserActivityController Unit Test', () => {
    let userActivityController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        userActivityController = new UserActivityController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllUserActivities', () => {
        it('should return all user activities', async () => {
        const mockActivities = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getUserActivityService.getDocuments.mockResolvedValue(mockActivities);

        await userActivityController.getAllUserActivities(reqMock, resMock);

        expect(ServiceFactory.getUserActivityService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockActivities);
        });

        it('should handle errors and return 500 if fetching activities fails', async () => {
        const error = new Error('Failed to fetch activities');
        ServiceFactory.getUserActivityService.getDocuments.mockRejectedValue(error);

        await userActivityController.getAllUserActivities(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getUserActivityById', () => {
        it('should return a user activity by ID', async () => {
        const mockActivity = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getUserActivityService.getDocumentById.mockResolvedValue(mockActivity);

        await userActivityController.getUserActivityById(reqMock, resMock);

        expect(ServiceFactory.getUserActivityService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockActivity);
        });

        it('should handle errors and return 500 if fetching by ID fails', async () => {
        const error = new Error('Failed to fetch user activity by ID');
        reqMock.params.id = '1';
        ServiceFactory.getUserActivityService.getDocumentById.mockRejectedValue(error);

        await userActivityController.getUserActivityById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});