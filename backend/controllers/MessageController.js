const ServiceFactory = require("../factories/serviceFactory.js");
const ExceptionHelper = require("../exception/ExceptionHelper.js");
const SignifyException = require("../exception/SignifyException.js");
const TimeUtils = require("../utilities/timeUtils.js");
const ControllerConstants = require("../constants/controllerConstants.js");
class MessageController {
    
    constructor(){
    }

    //creates a message entry in the database, with To and From + content and chat id - if a chat doesn't exist before sending a message, initialize an empty chat
    postMessage = async(request, response) =>{
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
            const mainUserPhoneNumberValidation = await ExceptionHelper.validate(request.body.mainUserPhoneNumber, 400, `mainUserPhoneNumber is required!`, response);
            if (mainUserPhoneNumberValidation) return mainUserPhoneNumberValidation;

            const messageIdValidation = await ExceptionHelper.validate(request.body.messageId, 400, `messageId is not provided!`, response);
            if (messageIdValidation) return messageIdValidation;

            //database validations
            const mainUserPhoneNumberUserObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.mainUserPhoneNumber})
            const mainUserObjectValidation = await ExceptionHelper.validate(mainUserPhoneNumberUserObject, 400, `mainUserPhoneNumber doesnt Exist in the user table!`, response);
            if (mainUserObjectValidation) return mainUserObjectValidation;

            //currently we only allowe deleting messages that are in 5 minutes range from the created date.
            //pass the createdDate here - WIP
            const canMessageBeDeleted = TimeUtils.isTimeDifferenceGreaterThanElapsedLimit(ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION, "");


            return response.json(message);
        }catch(exception) {
            return response.status(500).json({error: exception.message})
        }
    }
}
module.exports = MessageController;
