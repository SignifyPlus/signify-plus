const GroupController = require('../../../controllers/GroupController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getGroupService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('GroupController Unit Test', () => {
    let groupController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        groupController = new GroupController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllGroups', () => {
        it('should return all groups', async () => {
            const mockGroups = [{ id: '1' }, { id: '2' }];
            ServiceFactory.getGroupService.getDocuments.mockResolvedValue(mockGroups);

            await groupController.getAllGroups(reqMock, resMock);

            expect(ServiceFactory.getGroupService.getDocuments).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(mockGroups);
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Failed to get groups');
            ServiceFactory.getGroupService.getDocuments.mockRejectedValue(error);

            await groupController.getAllGroups(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getGroupById', () => {
        it('should return a group by ID', async () => {
            const mockGroup = { id: '1' };
            reqMock.params.id = '1';
            ServiceFactory.getGroupService.getDocumentById.mockResolvedValue(mockGroup);

            await groupController.getGroupById(reqMock, resMock);

            expect(ServiceFactory.getGroupService.getDocumentById).toHaveBeenCalledWith('1');
            expect(resMock.json).toHaveBeenCalledWith(mockGroup);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
            const error = new Error('Failed to get group by ID');
            reqMock.params.id = '1';
            ServiceFactory.getGroupService.getDocumentById.mockRejectedValue(error);

            await groupController.getGroupById(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
