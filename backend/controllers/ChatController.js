const ServiceFactory = require("../factories/serviceFactory.js");
const ExceptionHelper = require("../exception/ExceptionHelper.js");
const SignifyException = require("../exception/SignifyException.js");
class ChatController {
    
    constructor(){
    }

    initializeEmptyChat = async(request, response) => {
        try {
            const participants = await ExceptionHelper.validate(request.body.participants, 400, `participants array not provided. Please add the participants that will be participate in a chat - participants : [+905232314, +9023132145]`, response);
            if (participants) return participants;
            const particpantsUserObjects = await ServiceFactory.getUserService.getDocumentsByCustomFilters({phoneNumber: { $in: request.body.participants } })

            if (particpantsUserObjects.length != request.body.participants.length) {
                const signifyException = new SignifyException(400, `Not all phoneNumbers are registered to the User table - can't create a chat`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            
            const chat = await ServiceFactory.getChatService.saveDocument({
                participants: particpantsUserObjects.map(participant => participant._id.toString())
            });
            response.json(chat);
            
        }catch(exception) {
            const signifyException = new SignifyException(500, `Exception Occured: ${exception.message}`);
            return response.status(signifyException.status).json(signifyException.loadResult());
        }
    }
    
    //to do later
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