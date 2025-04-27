const ReportController = require('../../../controllers/ReportController');
const ServiceFactory = require('../../../factories/serviceFactory');

jest.mock('../../../factories/serviceFactory', () => ({
    getReportService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    },
}));

describe('ReportController Unit Test', () => {
    let reportController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        reportController = new ReportController();
        reqMock = { params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllReports', () => {
        it('should return all reports', async () => {
        const mockReports = [{ id: '1' }, { id: '2' }];
        ServiceFactory.getReportService.getDocuments.mockResolvedValue(mockReports);

        await reportController.getAllReports(reqMock, resMock);

        expect(ServiceFactory.getReportService.getDocuments).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockReports);
        });

        it('should handle errors and return 500', async () => {
        const error = new Error('Failed to fetch reports');
        ServiceFactory.getReportService.getDocuments.mockRejectedValue(error);

        await reportController.getAllReports(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getReportById', () => {
        it('should return a report by ID', async () => {
        const mockReport = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getReportService.getDocumentById.mockResolvedValue(mockReport);

        await reportController.getReportById(reqMock, resMock);

        expect(ServiceFactory.getReportService.getDocumentById).toHaveBeenCalledWith('1');
        expect(resMock.json).toHaveBeenCalledWith(mockReport);
        });

        it('should handle errors and return 500 when fetching by ID fails', async () => {
        const error = new Error('Failed to fetch report');
        reqMock.params.id = '1';
        ServiceFactory.getReportService.getDocumentById.mockRejectedValue(error);

        await reportController.getReportById(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
