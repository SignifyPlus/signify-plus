const ChannelSubscriber = require("../models/ChannelSubscriber")
const ChannelSubscriberService = require("../services/ChannelSubscriberService")
class ChannelSubscriberController {
    
    constructor(){
        this.channelSubscriberService = new ChannelSubscriberService(ChannelSubscriber);
    }
    //Get all ChannelSubscribers
    getAllChannelSubscribers = async(request, response) => {
        try {
            const channelSubscribers = await this.channelSubscriberService.getDocuments();
            response.json(channelSubscribers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ChannelSubscriber
    getChannelSubscriberById = async(request, response) => {
        try {
            const channelSubscriberId = request.params.id;
            const ChannelSubscriber = await this.channelSubscriberService.getDocumentById(channelSubscriberId);
            response.json(ChannelSubscriber);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ChannelSubscriberController;