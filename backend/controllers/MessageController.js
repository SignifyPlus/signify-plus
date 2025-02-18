const ServiceFactory = require("../factories/serviceFactory.js");
const ExceptionHelper = require("../exception/ExceptionHelper.js");
class MessageController {
    
    constructor(){
    }

    //creates a message entry in the database, with To and From + content and chat id - if a chat doesn't exist before sending a message, initialize an empty chat
    postMessage = async(request, response) =>{
        try {
            
            //validations
            const mainUserPhoneNumberValidation = await ExceptionHelper.validate(request.body.mainUserPhoneNumber, 400, `mainUserPhoneNumber is required!`, response);
            if (mainUserPhoneNumberValidation) return mainUserPhoneNumberValidation;

            const targetUserPhoneNumberValidation = await ExceptionHelper.validate(request.body.targetUserPhoneNumber, 400, `targetUserPhoneNumber is required!`, response);
            if (targetUserPhoneNumberValidation) return targetUserPhoneNumberValidation;

            const messageValidation = await ExceptionHelper.validate(request.body.message, 400, `message Content is required!`, response);
            if (messageValidation) return messageValidation;
            
            const [mainUserPhoneNumberUserObject, targetUserPhoneNumberUserObject] = await Promise.all([
                ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.mainUserPhoneNumber}),
                ServiceFactory.getUserService.getDocumentByCustomFilters({phoneNumber: request.body.targetUserPhoneNumber})]
            );

            console.log(mainUserPhoneNumberUserObject);
            console.log(targetUserPhoneNumberUserObject);

            const mainUserObjectValidation = await ExceptionHelper.validate(mainUserPhoneNumberUserObject, 400, `mainUserPhoneNumber doesnt Exist in the user table!`, response);
            console.log(mainUserObjectValidation);
            if (mainUserObjectValidation) return mainUserObjectValidation;


            const targetUserObjectValidation = await ExceptionHelper.validate(targetUserPhoneNumberUserObject, 400, `targetUserPhoneNumber doesnt Exist in the user table!`, response);
            if (targetUserObjectValidation) return targetUserObjectValidation;


        }catch(exception) {
            return response.status(500).json({error: exception.message})
        }
    }
}
module.exports = MessageController;