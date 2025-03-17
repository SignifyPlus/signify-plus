const express = require('express');
const userRouter = express.Router();
const ControllerFactory = require("../factories/controllerFactory.js");

userRouter.get('/all', ControllerFactory.getUserController().getAllUsers);

userRouter.post('/create', ControllerFactory.getUserController().createUser);

userRouter.delete('/delete/filter/', ControllerFactory.getUserController().deleteUser);

userRouter.delete('/delete/:id', ControllerFactory.getUserController().deleteUserById);

userRouter.get('/:id', ControllerFactory.getUserController().getUserById);

userRouter.get('/phone/:phoneNumber', ControllerFactory.getUserController().getUserByPhoneNumber);

module.exports = userRouter;
