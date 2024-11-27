const CallHistory = require("../models/CallHistory")
const CallHistoryService = require("../services/CallHistoryService")
class CallHistoryController {
    
    static async getCallHistory(request, response) {
        try {
            const callHistories = await CallHistoryService.getDocument();
            response.json(callHistories);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    static async getUserById(request, response) {
        try {
            const callHistoryByUserId= request.params.id;
            const callHistory = await CallHistoryService.getDocument(callHistoryByUserId);
            response.json(callHistory);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = CallHistoryController;