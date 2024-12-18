const UserActivity = require("../models/UserActivity")
const UserActivityService = require("../services/UserActivityService")
class UserActivityController {
    
    constructor(){
        this.userActivityService = new UserActivityService(UserActivity);
    }
    
    //Get all UserActivitys
    getAllUserActivities = async(request, response) => {
        try {
            const userActivities = await this.userActivityService.getDocument();
            response.json(userActivities);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single UserActivity
    getUserActivityById = async(request, response) => {
        try {
            const userActivityId = request.params.id;
            const userActivity = await this.userActivityService.getDocument(userActivityId);
            response.json(userActivity);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = UserActivityController;