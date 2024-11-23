const User = require("../models/User")
const UserService = require("../services/UserService")
class UserController {
    
    //Get all Users
    static async getAllUsers(request, response) {
        try {
            const users = await UserService.getDocument();
            response.json(users);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }

    //Get single user
    static async getUserById(request, response) {
        try {
            const userId = request.params.id;
            const user = await UserService.getDocument(userId);
            response.json(user);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }


}

modeule.exports = UserController;