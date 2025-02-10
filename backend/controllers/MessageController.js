const ServiceFactory = require("../factories/serviceFactory.js");
class MessageController {
    
    constructor(){
    }
    //Get all Messages - fetching this is dumb tho
    getAllMessages = async(request, response) =>{
        try {
            const messages = await ServiceFactory.getMessageService.getDocuments();
            response.json(messages);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Message
    getMessageById = async(request, response) => {
        try {
            const messageId = request.params.id;
            const message = await ServiceFactory.getMessageService.getDocumentById(messageId);
            response.json(message);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}
module.exports = MessageController;