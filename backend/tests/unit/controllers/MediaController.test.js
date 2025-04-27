const MediaController = require('../../../controllers/MediaController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getMediaService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('MediaController Unit Test', () => {
    let mediaController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        mediaController = new MediaController();
        reqMock = {};
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllMedia', () => {
        it('should return all media successfully', async () => {
        const mockMedia = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getMediaService.getDocuments.mockResolvedValue(mockMedia);

        await mediaController.getAllMedia(reqMock, resMock);

        expect(ServiceFactory.getMediaService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockMedia);
        });

        it('should handle errors and return 500 if getDocuments fails', async () => {
        const error = new Error('Failed to get media');
        ServiceFactory.getMediaService.getDocuments.mockRejectedValue(error);

        await mediaController.getAllMedia(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getMediaById', () => {
        it('should return media by ID successfully', async () => {
        const mockMedia = { id: '123' };
        reqMock.params = { id: '123' };
        ServiceFactory.getMediaService.getDocumentById.mockResolvedValue(mockMedia);
    
        await mediaController.getMediaById(reqMock, resMock);
    
        expect(ServiceFactory.getMediaService.getDocumentById).toHaveBeenCalledWith('123');
        expect(resMock.json).toHaveBeenCalledWith(mockMedia);
        });
    
        it('should handle errors and return 500 if getDocumentById fails', async () => {
        const error = new Error('Failed to get media by ID');
        reqMock.params = { id: '123' };
        ServiceFactory.getMediaService.getDocumentById.mockRejectedValue(error);
    
        await mediaController.getMediaById(reqMock, resMock);
    
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});