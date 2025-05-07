const GroupMemberController = require('../../../controllers/GroupMemberController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getGroupMemberService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('GroupMemberController Unit Test', () => {
    let groupMemberController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        groupMemberController = new GroupMemberController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllGroupMembers', () => {
        it('should return all group members', async () => {
        const mockGroupMembers = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getGroupMemberService.getDocuments.mockResolvedValue(mockGroupMembers);

        await groupMemberController.getAllGroupMembers(reqMock, resMock);

        expect(ServiceFactory.getGroupMemberService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockGroupMembers);
        });

        it('should handle errors and return 500', async () => {
        const error = new Error('Failed to get group members');
        ServiceFactory.getGroupMemberService.getDocuments.mockRejectedValue(error);

        await groupMemberController.getAllGroupMembers(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getGroupMemberById', () => {
        it('should return a group member by ID', async () => {
        const mockGroupMember = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getGroupMemberService.getDocumentById.mockResolvedValue(mockGroupMember);

        await groupMemberController.getGroupMemberById(reqMock, resMock);

        expect(ServiceFactory.getGroupMemberService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockGroupMember);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
        const error = new Error('Failed to get group member by ID');
        reqMock.params.id = '1';
        ServiceFactory.getGroupMemberService.getDocumentById.mockRejectedValue(error);

        await groupMemberController.getGroupMemberById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});