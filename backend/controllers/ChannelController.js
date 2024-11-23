const Chanel = require("../models/Channel")
const ChannelService = require("../services/ChannelService")
class ChannelController {
    
    //Get all channels
    static async getAllChannels(request, response) {
        try {
            const channels = await ChannelService.getDocument();
            response.json(channels);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }

    //Get single channel
    static async getChannelById(request, response) {
        try {
            const channelId = request.params.id;
            const channel = await ChannelService.getDocument(channelId);
            response.json(channel);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }


}

modeule.exports = ChannelController;