const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllThreads = 'mockGetAllThreads';

jest.mock('../../../factories/controllerFactory.js', () => ({
    getThreadController: () => ({
        getAllThreads: mockGetAllThreads,
    }),
}));

describe('ThreadRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ThreadRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllThreads);
    });
});