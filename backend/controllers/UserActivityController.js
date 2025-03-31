const ServiceFactory = require('../factories/serviceFactory.js');
class UserActivityController {
   constructor() {}

   //Get all UserActivitys
   getAllUserActivities = async (request, response) => {
      try {
         const userActivities =
            await ServiceFactory.getUserActivityService.getDocuments();
         response.json(userActivities);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single UserActivity
   getUserActivityById = async (request, response) => {
      try {
         const userActivityId = request.params.id;
         const userActivity =
            await ServiceFactory.getUserActivityService.getDocumentById(
               userActivityId,
            );
         response.json(userActivity);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = UserActivityController;
