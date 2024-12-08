const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController.js');

const userController = new UserController();

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:id', userController.getUserById);

userRouter.get('/create', userController.createUser)

userRouter.get('/delete', userController.deleteUser)

module.exports = userRouter;