const User = require("../models/User")
const UserService = require("../services/UserService")
class UserController {
    
    //Get all Users
    static async getAllUsers(request, response) {
        try {
            //initialize User Service first
            const users = await UserService.getData();
            response.json(users);
        }catch(exception) {
            response.status(500).json({error: error.message})
        }
    }
}

modeule.exports = UserController;