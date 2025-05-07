const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet
    })
}));

const mockGetAllGroups = 'mockGetAllGroups';

const MockGroupController = jest.fn().mockImplementation(() => ({
    getAllGroups: mockGetAllGroups
}));

jest.mock('../../../controllers/GroupController.js', () => MockGroupController);

describe('GroupRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        MockGroupController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all route', () => {
        require('../../../routes/GroupRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllGroups);
    });
});
