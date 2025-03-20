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
    
    getChatByPhoneNumber = async(request, response) => {
        try {
            const phoneNumberValidation = await ExceptionHelper.validate(request.params.phoneNumber, 400, `phoneNumber is not provided.`, response);
            if (phoneNumberValidation) return phoneNumberValidation;

            const userObject = await ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.params.phoneNumber});
            const chatsQuery = ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery({
                $or: [ //checks in both mainUserId + participants!
                    {mainUserId: userObject._id.toString()},
                    {participants: userObject._id.toString()}
                ]
            });
            const chats = await chatsQuery.populate({
                path: "mainUserId participants",
                select: "phoneNumber name"
            });

            response.json(await this.#getUserChats(chats));
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

    async getAllChats(){
        try {
            const chatsQuery = ServiceFactory.getChatService.getDocumentsQuery();
            return await chatsQuery.populate({
                path: "mainUserId participants",
                select: "phoneNumber"
            });
        }catch(exception) {
            return new SignifyException(500, `Exception Occured: ${exception.message}`);
        }
    }
    
    async #getUserChats(chats) {
        const chatObjects = [];
        const ZERO_INDEX = 0;
        for (const chat of chats) {
            const messages = await ServiceFactory.getMessageService.getDocumentsByCustomFiltersAndSortByCreatedAt({chatId: chat._id.toString()});
            const chatObject = chat.toObject();
            chatObject.lastMessage =  messages == null || messages.length == ZERO_INDEX ? 'Chat is Empty - No last Message available!' : messages[ZERO_INDEX].content;
            chatObject.totalNumberOfMessagesInChat = messages == null? 0 : messages.length;
            chatObjects.push(chatObject);
        }
        return chatObjects;
    }

    //Helper Methods
    async filterChat(cachedChats, phoneNumbers) {
        var chatId = null;
        for (var i = 0; i < cachedChats.length; i++) {
            ///the best way is to combine mainPhoneNumber and targetPhoneNumbers in an array
            //and match them with the array from the chat (mainuserIdPhoneNumber and participantsPhoneNumbers)
            //this way if we have an exact match, that's the chat
            const chatPhoneNumbers = [...cachedChats[i].participants, cachedChats[i].mainUserId];
            chatPhoneNumbers.sort();
            phoneNumbers.sort();
            //since sorted, the comparision will work
            //once compared, please also check that the length is exact or not - we should not be returning a chat where there are extra participants but the above two phoneNumbers are part of that chat
            //that will be a wrong chat then
            const perfectMatch = phoneNumbers.length == chatPhoneNumbers.length && phoneNumbers.every((value, index) => value == chatPhoneNumbers[index].phoneNumber);
            if (perfectMatch) {
                chatId = cachedChats[i]._id.toString();
                break;
            }
        }
        return chatId;
    }
}
module.exports = ChatController;