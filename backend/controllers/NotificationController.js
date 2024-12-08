const Notification = require("../models/Notification")
const NotificationService = require("../services/NotificationService")
class NotificationController {
    
    constructor(){
        this.notificationService = new NotificationService(Notification);
        this.getAllNotifications = this.getAllNotifications.bind(this);
        this.getNotificationById = this.getNotificationById.bind(this);
    }
    //Get all Notifications
    async getAllNotifications(request, response) {
        try {
            const notifications = await this.notificationService.getDocument();
            response.json(notifications);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Notification
    async getNotificationById(request, response) {
        try {
            const notificationId = request.params.id;
            const notification = await this.notificationService.getDocument(notificationId);
            response.json(notification);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = NotificationController;