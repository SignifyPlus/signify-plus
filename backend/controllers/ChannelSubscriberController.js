const ChannelSubscriber = require("../models/ChannelSubscriber")
const ChannelSubscriberService = require("../services/ChannelSubscriberService")
class ChannelSubscriberController {
    
    constructor(){
        this.channelSubscriberService = new ChannelSubscriberService(ChannelSubscriber);
        this.getAllChannelSubscribers = this.getAllChannelSubscribers.bind(this);
        this.getChannelSubscriberById = this.getChannelSubscriberById.bind(this);
    }
    //Get all ChannelSubscribers
    async getAllChannelSubscribers(request, response) {
        try {
            const channelSubscribers = await this.channelSubscriberService.getDocument();
            response.json(channelSubscribers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ChannelSubscriber
    async getChannelSubscriberById(request, response) {
        try {
            const channelSubscriberId = request.params.id;
            const ChannelSubscriber = await this.channelSubscriberService.getDocument(channelSubscriberId);
            response.json(ChannelSubscriber);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ChannelSubscriberController;