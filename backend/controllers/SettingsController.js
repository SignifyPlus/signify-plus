const Settings = require("../models/Settings")
const SettingsService = require("../services/SettingsService")
class SettingsController {
    
    constructor(){
        this.settingsService = new SettingsService(Settings);
    }

    //Get all Settingss
    getAllSettings = async(request, response) =>{
        try {
            const settings = await this.settingsService.getDocument();
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Settings
    getSettingsById = async(request, response) =>{
        try {
            const settingsId = request.params.id;
            const settings = await this.settingsService.getDocument(settingsId);
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = SettingsController;