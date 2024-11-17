const express = require('express');
const signifyPlusRouter = express.Router();
const UserController = require('../controllers/UserController.js');

//the base/app will use users/ route to get all users

signifyPlusRouter.get('/', UserController.getAllUsers);


module.exports = signifyPlusRouter