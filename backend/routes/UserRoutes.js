const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController.js');

const userController = new UserController();

userRouter.get('/all', userController.getAllUsers);

userRouter.post('/create', userController.createUser);

userRouter.delete('/delete/filter/', userController.deleteUser);

userRouter.delete('/delete/:id', userController.deleteUserById);

userRouter.get('/:id', userController.getUserById);

module.exports = userRouter;
