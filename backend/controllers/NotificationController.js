const Notification = require("../models/Notification")
const NotificationService = require("../services/NotificationService")
class NotificationController {
    
    constructor(){
        this.notificationService = new NotificationService(Notification);
    }
    //Get all Notifications
    getAllNotifications = async(request, response) =>{
        try {
            const notifications = await this.notificationService.getDocuments();
            response.json(notifications);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Notification
    getNotificationById = async(request, response) => {
        try {
            const notificationId = request.params.id;
            const notification = await this.notificationService.getDocumentById(notificationId);
            response.json(notification);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = NotificationController;