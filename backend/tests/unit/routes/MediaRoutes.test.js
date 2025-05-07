const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllMedia = 'mockGetAllMedia';

const mockMediaController = jest.fn().mockImplementation(() => ({
    getAllMedia: mockGetAllMedia,
}));

jest.mock('../../../controllers/MediaController.js', () => mockMediaController);

describe('MediaRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockMediaController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/MediaRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllMedia);
    });
});