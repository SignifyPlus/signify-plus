const ServiceFactory = require('../factories/serviceFactory.js');
class ReportController {
   constructor() {}

   //Get all Reports
   getAllReports = async (request, response) => {
      try {
         const reports = await ServiceFactory.getReportService.getDocuments();
         response.json(reports);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single Report
   getReportById = async (request, response) => {
      try {
         const reportId = request.params.id;
         const report =
            await ServiceFactory.getReportService.getDocumentById(reportId);
         response.json(report);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ReportController;
