const User = require("../models/User")
const UserService = require("../services/UserService")
class UserController {
    
    //Get all Users
    static async getAllUsers(request, response) {
        try {
            const users = await UserService.getDocument();
            response.json(users);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single user
    static async getUserById(request, response) {
        try {
            const userId = request.params.id;
            const user = await UserService.getDocument(userId);
            response.json(user);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Creates a user
    static async createUser(request, response) {
        try {
            const user = request.body;
            const userObject = await UserService.saveDocument(User, user);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Deletes a user
    static async deleteUser(request, response) {
        try {
            const user = request.body;
            const userObject = await UserService.deleteDocument(User, user);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

}

modeule.exports = UserController;