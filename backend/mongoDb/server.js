const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const fs = require('fs');
const User = require("../models/User");
const yaml = require('js-yaml');
require("dotenv").config();
const WebSocketManager = require("../managers/websocketManager");


const signifyPlusApp = express()
const mainServer = http.createServer(signifyPlusApp);

const mongoDburl = process.env.MONGO_DB_URL;
const port = process.env.PORT;

//use these for reading connecting string from firebase
mongoose.connect(mongoDburl).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

//seprate this out into service, just testing if its working or not

//root
signifyPlusApp.get("/", async (request, response) => {
    response.send('Hello, Welcome to SignifyPlus!');
})

//fetch -- create services now
signifyPlusApp.get("/getUsers", async (request, response) => {
    try {
        
        const users = await User.find().lean();
        response.json(users);
    }catch(exception) {
        response.status(500).json({error: error.message})
    }
})

//create
const createUser = async() => {
    try {
        const user = await User.create({
            userId: 1,
            name: 'Iman zahid',
            phoneNumber :'24125412515',
            passwordHash: 'hashed',
            profilePicture: '.txt',
            createdAt : new Date(),
        })
        console.log('User created:', user);

    } catch (error) {
    console.error('Error creating user:', error);
    }
}

//createUser();

mainServer.listen(port, () => {
    console.log("Server is Running")
    const websocketManager = new WebSocketManager(mainServer);
})
