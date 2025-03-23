const ServiceFactory = require("../factories/serviceFactory.js");
const ExceptionHelper = require("../exception/ExceptionHelper.js");
const SignifyException = require("../exception/SignifyException.js");
const TimeUtils = require("../utilities/timeUtils.js");
const CommonUtils = require("../utilities/commonUtils.js");
const ControllerConstants = require("../constants/controllerConstants.js");
class MessageController {
    
    constructor(){
    }

    //creates a message entry in the database, with To and From + content and chat id - if a chat doesn't exist before sending a message, initialize an empty chat
    //refactor postMessage so it can be used by the event listeners as well
    postMessage = async(request, response) => {
        try {
            //request validations
            const mainUserPhoneNumberValidation = await ExceptionHelper.validate(request.body.mainUserPhoneNumber, 400, `mainUserPhoneNumber is required!`, response);
            if (mainUserPhoneNumberValidation) return mainUserPhoneNumberValidation;

            const targetUserPhoneNumbersValidation = await ExceptionHelper.validate(request.body.targetUserPhoneNumbers, 400, `targetUserPhoneNumbers is required! - it's an array [+902313124, +9014214125]`, response);
            if (targetUserPhoneNumbersValidation) return targetUserPhoneNumbersValidation;

            const messageValidation = await ExceptionHelper.validate(request.body.message, 400, `message Content is required!`, response);
            if (messageValidation) return messageValidation;

            //database validations
            const mainUserPhoneNumberUserObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.mainUserPhoneNumber})
            const mainUserObjectValidation = await ExceptionHelper.validate(mainUserPhoneNumberUserObject, 400, `mainUserPhoneNumber doesnt Exist in the user table!`, response);
            if (mainUserObjectValidation) return mainUserObjectValidation;

            const targetUserPhoneNumberUserObjects = await ServiceFactory.getUserService.getDocumentsByCustomFilters({phoneNumber: {$in: request.body.targetUserPhoneNumbers}})
            
            if (targetUserPhoneNumberUserObjects.length != request.body.targetUserPhoneNumbers.length) {
                const signifyException = new SignifyException(400, `Not all phoneNumbers are registered to the User table!`);
                return response.status(signifyException.status).json(signifyException.loadResult());
            }
            
            const mappedTargetUserPhoneNumbersToId = targetUserPhoneNumberUserObjects.map(user => user._id.toString());
            const mappedMainUserId = mainUserPhoneNumberUserObject._id.toString();

            var chat = await ServiceFactory.getChatService.getDocumentByCustomFilters({
                mainUserId: mappedMainUserId,
                participants: { $all: mappedTargetUserPhoneNumbersToId,
                                $size: targetUserPhoneNumberUserObjects.length
                }
            }) 

            if (!chat) {
                console.log("Chat Doesnt Exist - initializing a new chat");
                chat = await ServiceFactory.getChatService.saveDocument({
                    mainUserId: mappedMainUserId,
                    participants: mappedTargetUserPhoneNumbersToId
                });
            }
            const message = await ServiceFactory.getMessageService.saveDocument({
                senderId: mappedMainUserId,
                receiverIds: mappedTargetUserPhoneNumbersToId,
                chatId: chat._id.toString(),
                content: request.body.message
            });
            return response.json(message);
        }catch(exception) {
            return response.status(500).json({error: exception.message})
        }
    }

    //feature for deleting a message (within a timespan of 1 minute)
    deleteMessage = async(request, response) =>{
        try {
            //request validations
            const senderPhoneNumberValidation = await ExceptionHelper.validate(request.body.senderPhoneNumber, 400, `senderPhoneNumber is required!`, response);
            if (senderPhoneNumberValidation) return senderPhoneNumberValidation;

            const messageIdValidation = await ExceptionHelper.validate(request.body.messageId, 400, `messageId is not provided!`, response);
            if (messageIdValidation) return messageIdValidation;

            //database validations
            const senderPhoneNumberUserObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.senderPhoneNumber})
            const senderUserObjectValidation = await ExceptionHelper.validate(senderPhoneNumberUserObject, 400, `senderPhoneNumber doesnt Exist in the user table!`, response);
            if (senderUserObjectValidation) return senderUserObjectValidation;

            //why are we querying on phoneNumber and messageID - we dont want another use to tap on the message and try to delete that since that message isn't own by them
            //only the one who sent it can delete it within 5 minutes timespan
            const messageToDelete = await ServiceFactory.getMessageService.getDocumentByCustomFilters({_id: request.body.messageId, senderId: senderPhoneNumberUserObject._id.toString()})
            const messageToDeleteValidation = await ExceptionHelper.validate(messageToDelete, 400, `Message Doesn't Belong to the user!!`, response);
            if (messageToDeleteValidation) return messageToDeleteValidation;
            
            const createdDateTimeInSeconds = TimeUtils.getTimeInSeconds(messageToDelete.createdAt.getTime());
            const canMessageBeDeleted = TimeUtils.isTimeDifferenceLessThanElapsedLimit(ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION, createdDateTimeInSeconds);
            const finalResponse = canMessageBeDeleted? {message: `Message Deleted: ${messageToDelete}`} : {message: "Message Can't be deleted - it's too old"};
            finalResponse ? await ServiceFactory.getMessageService.deleteDocument({_id: messageToDelete._id.toString()}) : null;
            return response.json(finalResponse);
        }catch(exception) {
            return response.status(500).json({error: exception.message})
        }
    }

    //event database post methods
    async postMessageToDb(mainUser, participants, message, chatId) {
        //in the case of building chat history, we shouldn't let the application crash
        //websockets are realtime, and throwing exceptions can lead to bad user experience.
        //persistence of chat should take second priority so 
        //if a chat doesn't exist, or if an XYZ user is missing from the user tble dont persist anything and send back an appropriate response, or log error etc
        const mainUserPhoneNumberUserObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: mainUser});
        if (await CommonUtils.isValueNull(mainUserPhoneNumberUserObject)) {
            return null;
        }

        const targetUserPhoneNumberUserObjects = await ServiceFactory.getUserService.getDocumentsByCustomFilters({phoneNumber: {$in: participants}})
        if (targetUserPhoneNumberUserObjects.length != participants.length) {
            return null;
        }
        
        const mappedTargetUserPhoneNumbersToId = targetUserPhoneNumberUserObjects.map(user => user._id.toString());
        const mappedMainUserId = mainUserPhoneNumberUserObject._id.toString();
        
        return await ServiceFactory.getMessageService.saveDocument({
            senderId: mappedMainUserId,
            receiverIds: mappedTargetUserPhoneNumbersToId,
            chatId: chatId,
            content: message
        });
    }
}
module.exports = MessageController;
