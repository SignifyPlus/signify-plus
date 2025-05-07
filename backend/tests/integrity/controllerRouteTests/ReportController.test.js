const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const reportSvc = {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
    };
    return {
        get getReportService() { return reportSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const reportSvc = ServiceFactory.getReportService;

describe('ReportController integrity routes', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /reports/all returns 200 and array', async () => {
        const mockReports = [
            { _id: 'rep1', title: 'Spam report' },
            { _id: 'rep2', title: 'Abuse report' },
        ];
        reportSvc.getDocuments.mockResolvedValueOnce(mockReports);

        const res = await request(app).get('/reports/all');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockReports);
        expect(reportSvc.getDocuments).toHaveBeenCalled();
    });

    it('GET /reports/id/:id returns report by id', async () => {
        const id  = 'rep1';
        const doc = { _id: id, title: 'Spam report' };
        reportSvc.getDocumentById.mockResolvedValueOnce(doc);

        const res = await request(app).get(`/reports/id/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(doc);
        expect(reportSvc.getDocumentById).toHaveBeenCalledWith(id);
    });
});