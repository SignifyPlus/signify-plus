const ServiceFactory = require('../factories/serviceFactory.js');
class ChannelController {
   constructor() {}
   //Get all channels
   getAllChannels = async (request, response) => {
      try {
         const channels = await ServiceFactory.getChannelService.getDocuments();
         response.json(channels);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single channel
   getChannelById = async (request, response) => {
      try {
         const channelId = request.params.id;
         const channel =
            await ServiceFactory.getChannelService.getDocumentById(channelId);
         response.json(channel);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ChannelController;
