const Message = require("../models/Message")
const MessageService = require("../services/MessageService")
class MessageController {
    
    constructor(){
        this.messageService = new MessageService(Message);
        this.getAllMessages = this.getAllMessages.bind(this);
        this.getMessageById = this.getMessageById.bind(this);
    }
    //Get all Messages - fetching this is dumb tho
    async getAllMessages(request, response) {
        try {
            const messages = await this.messageService.getDocument();
            response.json(messages);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Message
    async getMessageById(request, response) {
        try {
            const messageId = request.params.id;
            const message = await this.messageService.getDocument(messageId);
            response.json(message);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}
module.exports = MessageController;