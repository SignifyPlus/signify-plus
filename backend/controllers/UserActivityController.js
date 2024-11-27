const UserActivity = require("../models/UserActivity")
const UserActivityService = require("../services/UserActivityService")
class UserActivityController {
    
    //Get all UserActivitys
    static async getAllUserActivities(request, response) {
        try {
            const userActivities = await UserActivityService.getDocument();
            response.json(userActivities);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single UserActivity
    static async getUserActivityById(request, response) {
        try {
            const userActivityId = request.params.id;
            const userActivity = await UserActivityService.getDocument(userActivityId);
            response.json(userActivity);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = UserActivityController;