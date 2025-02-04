const Message = require("../models/Message")
const MessageService = require("../services/MessageService")
class MessageController {
    
    constructor(){
        this.messageService = new MessageService(Message);
    }
    //Get all Messages - fetching this is dumb tho
    getAllMessages = async(request, response) =>{
        try {
            const messages = await this.messageService.getDocuments();
            response.json(messages);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Message
    getMessageById = async(request, response) => {
        try {
            const messageId = request.params.id;
            const message = await this.messageService.getDocumentById(messageId);
            response.json(message);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}
module.exports = MessageController;