const Chanel = require("../models/Channel")
const ChannelService = require("../services/ChannelService")
class ChannelController {
    
    constructor(){
        this.channelService = new ChannelService(Chanel);
    }
    //Get all channels
    getAllChannels = async(request, response) =>{
        try {
            const channels = await this.channelService.getDocuments();
            response.json(channels);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single channel
    getChannelById = async(request, response) => {
        try {
            const channelId = request.params.id;
            const channel = await this.channelService.getDocumentById(channelId);
            response.json(channel);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ChannelController;