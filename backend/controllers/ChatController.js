const ServiceFactory = require("../factories/serviceFactory.js");
class ChatController {
    
    constructor(){
    }
    
    getChatByPhoneNumber = async(request, response) => {
        try {
            const phoneNumber = request.params.phoneNumber;
            const chat = await ServiceFactory.getChatService.getDocumentByCustomFilters({phoneNumber: phoneNumber});
            response.json(chat);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}
module.exports = ChatController;