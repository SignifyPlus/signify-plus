const Report = require("../models/Report")
const ReportService = require("../services/ReportService")
class ReportController {
    
    constructor(){
        this.reportService = new ReportService(Report);
    }

    //Get all Reports
    getAllReports = async(request, response) =>{
        try {
            const reports = await this.reportService.getDocuments();
            response.json(reports);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Report
    getReportById = async(request, response) =>{
        try {
            const reportId = request.params.id;
            const report = await this.reportService.getDocumentById(reportId);
            response.json(report);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ReportController;