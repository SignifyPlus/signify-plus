const ServiceFactory = require('../factories/serviceFactory.js');
class ChannelSubscriberController {
   constructor() {}
   //Get all ChannelSubscribers
   getAllChannelSubscribers = async (request, response) => {
      try {
         const channelSubscribers =
            await ServiceFactory.getChannelSubscriberService.getDocuments();
         response.json(channelSubscribers);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single ChannelSubscriber
   getChannelSubscriberById = async (request, response) => {
      try {
         const channelSubscriberId = request.params.id;
         const ChannelSubscriber =
            await ServiceFactory.getChannelSubscriberService.getDocumentById(
               channelSubscriberId,
            );
         response.json(ChannelSubscriber);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ChannelSubscriberController;
