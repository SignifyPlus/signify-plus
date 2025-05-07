const ReactionController = require('../../../controllers/ReactionController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getReactionService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ReactionController Unit Test', () => {
    let reactionController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        reactionController = new ReactionController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllReactions', () => {
        it('should return all reactions', async () => {
        const mockReactions = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getReactionService.getDocuments.mockResolvedValue(mockReactions);

        await reactionController.getAllReactions(reqMock, resMock);

        expect(ServiceFactory.getReactionService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockReactions);
        });

        it('should handle errors and return 500', async () => {
        const error = new Error('Failed to fetch reactions');
        ServiceFactory.getReactionService.getDocuments.mockRejectedValue(error);

        await reactionController.getAllReactions(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getReactionById', () => {
        it('should return a reaction by ID', async () => {
        const mockReaction = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getReactionService.getDocumentById.mockResolvedValue(mockReaction);

        await reactionController.getReactionById(reqMock, resMock);

        expect(ServiceFactory.getReactionService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockReaction);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
        const error = new Error('Failed to fetch reaction');
        reqMock.params.id = '1';
        ServiceFactory.getReactionService.getDocumentById.mockRejectedValue(error);

        await reactionController.getReactionById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
