const ServiceFactory = require('../factories/serviceFactory.js');
class CallHistoryController {
   constructor() {}

   getCallHistory = async (request, response) => {
      try {
         const callHistories =
            await ServiceFactory.getCallHistoryService.getDocuments();
         response.json(callHistories);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   getCallHistoryByUserId = async (request, response) => {
      try {
         const callHistoryByUserId = request.params.id;
         const callHistory =
            await ServiceFactory.getCallHistoryService.getDocumentById(
               callHistoryByUserId,
            );
         response.json(callHistory);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = CallHistoryController;
