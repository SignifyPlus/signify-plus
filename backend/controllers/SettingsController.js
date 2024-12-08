const Settings = require("../models/Settings")
const SettingsService = require("../services/SettingsService")
class SettingsController {
    
    constructor(){
        this.settingsService = new SettingsService(Settings);
        this.getAllSettings = this.getAllSettings.bind(this);
        this.getSettingsById = this.getSettingsById.bind(this);
    }

    //Get all Settingss
    async getAllSettings(request, response) {
        try {
            const settings = await this.settingsService.getDocument();
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Settings
    async getSettingsById(request, response) {
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