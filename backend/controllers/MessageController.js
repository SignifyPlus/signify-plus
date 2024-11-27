const Message = require("../models/Message")
const MessageService = require("../services/MessageService")
class MessageController {
    
    //Get all Messages - fetching this is dumb tho
    static async getAllMessages(request, response) {
        try {
            const messages = await MessageService.getDocument();
            response.json(messages);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Message
    static async getMessageById(request, response) {
        try {
            const messageId = request.params.id;
            const message = await MessageService.getDocument(messageId);
            response.json(message);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = MessageController;