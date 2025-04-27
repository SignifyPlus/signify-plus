const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllReactions = 'mockGetAllReactions';

const mockReactionController = jest.fn().mockImplementation(() => ({
    getAllReactions: mockGetAllReactions,
}));

jest.mock('../../../controllers/ReactionController.js', () => mockReactionController);

describe('ReactionRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockReactionController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ReactionRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllReactions);
    });
});
