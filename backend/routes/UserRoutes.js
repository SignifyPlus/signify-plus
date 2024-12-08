const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController.js');

const userController = new UserController();

userRouter.get('/all', userController.getAllUsers);

userRouter.get('/create', userController.createUser);

userRouter.get('/delete', userController.deleteUser);

userRouter.get('/:id', userController.getUserById);

module.exports = userRouter;