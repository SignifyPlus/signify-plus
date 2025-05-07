const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

const mockGetAllGroupMembers = 'mockGetAllGroupMembers';

const MockGroupMemberController = jest.fn().mockImplementation(() => ({
    getAllGroupMembers: mockGetAllGroupMembers
}));

jest.mock('../../../controllers/GroupMemberController.js', () => MockGroupMemberController);

describe('GroupMemberRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        MockGroupMemberController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route', () => {
        require('../../../routes/GroupMemberRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllGroupMembers);
    });
});
