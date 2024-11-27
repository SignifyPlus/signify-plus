const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController.js');

userRouter.get('/', UserController.getAllUsers);

userRouter.get('/:id', UserController.getUserById);

userRouter.get('/create', UserController.createUser)

userRouter.get('/delete', UserController.deleteUser)

module.exports = userRouter;