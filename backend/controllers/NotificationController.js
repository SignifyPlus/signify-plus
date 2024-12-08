const Notification = require("../models/Notification")
const NotificationService = require("../services/NotificationService")
class NotificationController {
    
    //Get all Notifications
    static async getAllNotifications(request, response) {
        try {
            const notifications = await NotificationService.getDocument();
            response.json(notifications);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Notification
    static async getNotificationById(request, response) {
        try {
            const notificationId = request.params.id;
            const notification = await NotificationService.getDocument(notificationId);
            response.json(notification);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = NotificationController;