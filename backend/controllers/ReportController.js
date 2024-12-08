const Report = require("../models/Report")
const ReportService = require("../services/ReportService")
class ReportController {
    
    constructor(){
        this.reportService = new ReportService(Report);
        this.getAllReports = this.getAllReports.bind(this);
        this.getReportById = this.getReportById.bind(this);
    }

    //Get all Reports
    async getAllReports(request, response) {
        try {
            const reports = await this.reportService.getDocument();
            response.json(reports);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Report
    async getReportById(request, response) {
        try {
            const reportId = request.params.id;
            const report = await this.reportService.getDocument(reportId);
            response.json(report);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ReportController;