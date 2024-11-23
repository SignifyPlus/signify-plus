const Settings = require("../models/Settings")
const SettingsService = require("../services/SettingsService")
class SettingsController {
    
    //Get all Settingss
    static async getAllSettingss(request, response) {
        try {
            const settings = await SettingsService.getDocument();
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }

    //Get single Settings
    static async getSettingsById(request, response) {
        try {
            const settingsId = request.params.id;
            const settings = await SettingsService.getDocument(settingsId);
            response.json(settings);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }


}

modeule.exports = SettingsController;