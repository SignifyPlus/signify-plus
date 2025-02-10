const ServiceFactory = require("../factories/serviceFactory.js");
class SettingsController {
    
    constructor(){
    }

    //Get all Settingss
    getAllSettings = async(request, response) =>{
        try {
            const settings = await ServiceFactory.getSettingsService.getDocuments();
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Settings
    getSettingsById = async(request, response) =>{
        try {
            const settingsId = request.params.id;
            const settings = await ServiceFactory.getSettingsService.getDocumentById(settingsId);
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = SettingsController;