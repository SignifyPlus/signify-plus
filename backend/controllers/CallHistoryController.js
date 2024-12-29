const CallHistory = require("../models/CallHistory")
const CallHistoryService = require("../services/CallHistoryService")
class CallHistoryController {

    constructor(){
        this.callHistoryService = new CallHistoryService(CallHistory);
    }

    getCallHistory = async(request, response) => {
        try {
            const callHistories = await this.callHistoryService.getDocument();
            response.json(callHistories);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    getCallHistoryByUserId = async(request, response) => {
        try {
            const callHistoryByUserId= request.params.id;
            const callHistory = await this.callHistoryService.getDocument(callHistoryByUserId);
            response.json(callHistory);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = CallHistoryController;