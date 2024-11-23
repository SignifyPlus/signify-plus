const express = require('express');
//please just create a single router and use it everywhere!
const signifyPlusRouter = express.Router();
const UserController = require('../controllers/UserController.js');

//the base/app will use users/ route to get all users

signifyPlusRouter.get('/', UserController.getAllUsers);

signifyPlusRouter.get('/:id', UserController.getUserById);

module.exports = signifyPlusRouter