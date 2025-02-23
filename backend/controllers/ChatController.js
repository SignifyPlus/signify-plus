const ServiceFactory = require("../factories/serviceFactory.js");
const ExceptionHelper = require("../exception/ExceptionHelper.js");
const SignifyException = require("../exception/SignifyException.js");
const { default: mongoose } = require("mongoose");
class ChatController {
    
    constructor(){
    }

    initializeEmptyChat = async(request, response) => {
        try {
            //request validation
            const mainUserPhoneNumberValidation = await ExceptionHelper.validate(request.body.mainUserPhoneNumber, 400, `mainUserPhoneNumber is not provided.`, response);
            if (mainUserPhoneNumberValidation) return mainUserPhoneNumberValidation;
 
            const participants = await ExceptionHelper.validate(request.body.participants, 400, `participants array not provided. Please add the participants that will be participate in a chat - participants : [+905232314, +9023132145]`, response);
            if (participants) return participants;

            //main User table validation
            const mainUserPhoneNumberUserObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.mainUserPhoneNumber});
            const mainUserObjectValidation = await ExceptionHelper.validate(mainUserPhoneNumberUserObject, 400, `mainUserPhoneNumber doesnt Exist in the user table!`, response);
            if (mainUserObjectValidation) return mainUserObjectValidation;

            //participants validation
            const particpantsUserObjects = await ServiceFactory.getUserService.getDocumentsByCustomFilters({phoneNumber: { $in: request.body.participants } })
            if (particpantsUserObjects.length != request.body.participants.length) {
                const signifyException = new SignifyException(400, `Not all phoneNumbers are registered to the User table - can't create a chat`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            //create chat document/object
            const chat = await ServiceFactory.getChatService.saveDocument({
                mainUserId: mainUserPhoneNumberUserObject._id.toString(),
                participants: particpantsUserObjects.map(participant => participant._id.toString())
            });

            return response.json(chat);
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

    getChatHistoryById = async(request, response) => {
        try {
            const chatIdValidation = await ExceptionHelper.validate(request.params.chatId, 400, `chatId is not provided.`, response);
            if (chatIdValidation) return chatIdValidation;

            const retrievedChat =  ServiceFactory.getMessageService.getDocumentsByCustomFiltersQuery({chatId: new mongoose.Types.ObjectId(request.params.chatId)});
            const populatedChatData = await retrievedChat.populate({
                path: 'senderId receiverIds',
                select: 'name phoneNumber'
            });
            response.json({
                "messages": populatedChatData,
                "totalNumberOfMessages": populatedChatData.length
            });
        }catch(exception) {
            const signifyException = new SignifyException(500, `Exception Occured: ${exception.message}`);
            return response.status(signifyException.status).json(signifyException.loadResult());
        }
    }

}
module.exports = ChatController;