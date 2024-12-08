const ChannelSubscriber = require("../models/ChannelSubscriber")
const ChannelSubscriberService = require("../services/ChannelSubscriberService")
class ChannelSubscriberController {
    
    //Get all ChannelSubscribers
    static async getAllChannelSubscribers(request, response) {
        try {
            const channelSubscribers = await ChannelSubscriberService.getDocument();
            response.json(channelSubscribers);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single ChannelSubscriber
    static async getChannelSubscriberById(request, response) {
        try {
            const channelSubscriberId = request.params.id;
            const ChannelSubscriber = await ChannelSubscriberService.getDocument(channelSubscriberId);
            response.json(ChannelSubscriber);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = ChannelSubscriberController;