const ServiceFactory = require('../factories/serviceFactory.js');
class ThreadController {
   constructor() {}

   //Get all threads
   getAllThreads = async (request, response) => {
      try {
         const threads = await ServiceFactory.getThreadService.getDocuments();
         response.json(threads);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = ThreadController;
