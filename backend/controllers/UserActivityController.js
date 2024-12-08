const UserActivity = require("../models/UserActivity")
const UserActivityService = require("../services/UserActivityService")
class UserActivityController {
    
    constructor(){
        this.userActivityService = new UserActivityService(UserActivity);
        this.getAllUserActivities = this.getAllUserActivities.bind(this);
        this.getUserActivityById = this.getUserActivityById.bind(this);
    }
    
    //Get all UserActivitys
    async getAllUserActivities(request, response) {
        try {
            const userActivities = await this.userActivityService.getDocument();
            response.json(userActivities);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single UserActivity
    async getUserActivityById(request, response) {
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