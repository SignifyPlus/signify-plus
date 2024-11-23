const Report = require("../models/Report")
const ReportService = require("../services/ReportService")
class ReportController {
    
    //Get all Reports
    static async getAllReports(request, response) {
        try {
            const reports = await ReportService.getDocument();
            response.json(reports);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }

    //Get single Report
    static async getReportById(request, response) {
        try {
            const reportId = request.params.id;
            const report = await ReportService.getDocument(reportId);
            response.json(report);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }


}

modeule.exports = ReportController;