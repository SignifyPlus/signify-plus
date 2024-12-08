const Chanel = require("../models/Channel")
const ChannelService = require("../services/ChannelService")
class ChannelController {
    
    constructor(){
        this.channelService = new ChannelService(Chanel);
        this.getAllChannels = this.getAllChannels.bind(this);
        this.getChannelById = this.getChannelById.bind(this);
    }
    //Get all channels
    static async getAllChannels(request, response) {
        try {
            const channels = await this.channelService.getDocument();
            response.json(channels);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single channel
    static async getChannelById(request, response) {
        try {
            const channelId = request.params.id;
            const channel = await this.channelService.getDocument(channelId);
            response.json(channel);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ChannelController;