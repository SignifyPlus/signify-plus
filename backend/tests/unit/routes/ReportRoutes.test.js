const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

const mockGetAllReports = 'mockGetAllReports';

const mockReportController = jest.fn().mockImplementation(() => ({
    getAllReports: mockGetAllReports,
}));

jest.mock('../../../controllers/ReportController.js', () => mockReportController);

describe('ReportRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockReportController.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/ReportRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', mockGetAllReports);
    });
});
