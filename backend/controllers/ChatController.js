const ServiceFactory = require("../factories/serviceFactory.js");
const SignifyException = require("../exception/SignifyException.js");
class ChatController {
    
    constructor(){
    }

    initializeEmptyChat = async(request, response) => {
        try {
            if (request.body.mainUserPhoneNumber === undefined || request.body.targetUserPhoneNumber === undefined) {
                const signifyException = new SignifyException(400, ` mainUserPhoneNumber or targetUserPhoneNumber not provided!`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }

            const [mainUserPhoneNumberUserObject, targetUserPhoneNumberUserObject] = await Promise.all([
                ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.mainUserPhoneNumber}),
                ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.targetUserPhoneNumber})]
            );

            if (mainUserPhoneNumberUserObject == null || targetUserPhoneNumberUserObject == null) {
                const signifyException = new SignifyException(400, ` mainUserPhoneNumber or targetUserPhoneNumber Users don't exist - please register them first!`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            
            const [mainUserPhoneNumberId, targetUserPhoneNumberId] = [mainUserPhoneNumberUserObject._id.toString(), targetUserPhoneNumberUserObject._id.toString()]
            const chat = await ServiceFactory.getChatService.saveDocument({mainUserId: mainUserPhoneNumberId, toUserId: targetUserPhoneNumberId});
            response.json(chat);
            
        }catch(exception) {
            const signifyException = new SignifyException(500, `Exception Occured: ${exception.message}`);
            return response.status(signifyException.status).json(signifyException.loadResult());
        }
    }
    
    getChatByPhoneNumber = async(request, response) => {
        try {
            const phoneNumber = request.params.phoneNumber;
            const chat = await ServiceFactory.getChatService.getDocumentByCustomFilters({phoneNumber: phoneNumber});
            response.json(chat);
        }catch(exception) {
            const signifyException = new SignifyException(500, `Exception Occured: ${exception.message}`);
            return response.status(signifyException.status).json(signifyException.loadResult());
        }
    }
}
module.exports = ChatController;