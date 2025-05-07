const ForumPermissionsController = require('../../../controllers/ForumPermissionsController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getForumPermissionsService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ForumPermissionsController Unit Test', () => {
    let forumPermissionsController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        forumPermissionsController = new ForumPermissionsController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllForumPermissionss', () => {
        it('should return all forum permissions', async () => {
            const mockPermissions = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getForumPermissionsService.getDocuments.mockResolvedValue(mockPermissions);

            await forumPermissionsController.getAllForumPermissionss(reqMock, resMock);

            expect(ServiceFactory.getForumPermissionsService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockPermissions);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to fetch permissions');
            ServiceFactory.getForumPermissionsService.getDocuments.mockRejectedValue(error);

            await forumPermissionsController.getAllForumPermissionss(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getForumPermissionsById', () => {
        it('should return forum permission by ID', async () => {
            const mockPermission = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getForumPermissionsService.getDocumentById.mockResolvedValue(mockPermission);

            await forumPermissionsController.getForumPermissionsById(reqMock, resMock);

            expect(ServiceFactory.getForumPermissionsService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockPermission);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
            const error = new Error('Failed to fetch permission by ID');
            reqMock.params.id = '1';
            ServiceFactory.getForumPermissionsService.getDocumentById.mockRejectedValue(error);

            await forumPermissionsController.getForumPermissionsById(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});