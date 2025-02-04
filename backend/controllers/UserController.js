const User = require("../models/User")
const UserService = require("../services/UserService.js")
class UserController {

    constructor(){
        this.userService = new UserService(User);
    }
    
    //Get all Users
    getAllUsers = async(request, response) => {
        try {
            console.log("Fetching all users from getAllUsers...");
            const users = await this.userService.getDocuments();
            response.json(users);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single user
    getUserById = async(request, response) =>  {
        try {
            console.log("Fetching all users from getUserById...");
            const userId = request.params.id;
            const user = await this.userService.getDocumentById(userId);
            response.json(user);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get a single User by PhoneNumber
    getUserByPhoneNumber = async(request, response) => {
        try {
            console.log("Fetching user with Phone Number...");
            const phoneNumber = request.params.phoneNumber;
            const user = await this.userService.getDocumentByCustomFilters({phoneNumber: phoneNumber});
            response.json(user);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
    

    //Creates a user
    createUser = async(request, response) => {
        try {
            console.log("Creating User...");
            const user = request.body;
            console.log(user)
            const userObject = await this.userService.saveDocument(user);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Deletes a user
    deleteUser = async(request, response) =>  {
        try {
            const filters = request.query;
            console.log("Filters: ", filters);
            console.log("Keys", Object.keys(filters));
            const userObject = await this.userService.deleteDocument(filters);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Deletes a user
    deleteUserById = async(request, response) =>  {
        try {
            const userId = request.params.id;
            console.log(userId)
            const userObject = await this.userService.deleteDocumentById(userId);
            response.json(userObject);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = UserController;