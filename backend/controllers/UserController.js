const User = require("../models/User")
const UserService = require("../services/UserService.js")
class UserController {

    constructor(){
        this.userService = new UserService(User);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    
    //Get all Users
    async getAllUsers(request, response) {
        try {
            console.log("Fetching all users from getAllUsers...");
            const users = await this.userService.getDocument();
            response.json(users);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single user
    async getUserById(request, response) {
        try {
            console.log("Fetching all users from getUserById...");
            const userId = request.params.id;
            const user = await this.userService.getDocument(userId);
            response.json(user);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Creates a user
    async createUser(request, response) {
        try {
            const user = request.body;
            const userObject = await this.userService.saveDocument(User, user);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Deletes a user
    async deleteUser(request, response) {
        try {
            const user = request.body;
            const userObject = await this.userService.deleteDocument(User, user);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

}

module.exports = UserController;