const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
require("dotenv").config();
const WebSocketManager = require("../managers/websocketManager.js");
const userRoutes = require("../routes/UserRoutes.js")
const homeRoutes = require("../routes/HomeRoute.js")
const contactRoutes = require("../routes/ContactRoutes.js")
const Encrypt = require("../utilities/encrypt.js")

const signifyPlusApp = express();
signifyPlusApp.use(express.json());
const mainServer = http.createServer(signifyPlusApp);

const mongoDburl = process.env.MONGO_DB_URL;
const port = process.env.PORT;

signifyPlusApp.use('/users', userRoutes);
signifyPlusApp.use('/', homeRoutes);
signifyPlusApp.use('/contacts', contactRoutes);


//use these for reading connecting string from firebase
mongoose.connect(mongoDburl).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

mainServer.listen(port, () => {
    console.log("Server is Running")
    const websocketManager = new WebSocketManager(mainServer);
})
