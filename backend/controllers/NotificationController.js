const ServiceFactory = require('../factories/serviceFactory.js');
class NotificationController {
   constructor() {}
   //Get all Notifications
   getAllNotifications = async (request, response) => {
      try {
         const notifications =
            await ServiceFactory.getNotificationService.getDocuments();
         response.json(notifications);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single Notification
   getNotificationById = async (request, response) => {
      try {
         const notificationId = request.params.id;
         const notification =
            await ServiceFactory.getNotificationService.getDocumentById(
               notificationId,
            );
         response.json(notification);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = NotificationController;
