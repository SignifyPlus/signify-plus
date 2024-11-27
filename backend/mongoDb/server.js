const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const fs = require('fs');
const yaml = require('js-yaml');
require("dotenv").config();
const WebSocketManager = require("../managers/websocketManager");


const signifyPlusApp = express(express.json())
const mainServer = http.createServer(signifyPlusApp);

const mongoDburl = process.env.MONGO_DB_URL;
const port = process.env.PORT;

//use these for reading connecting string from firebase
mongoose.connect(mongoDburl).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

mainServer.listen(port, () => {
    console.log("Server is Running")
    const websocketManager = new WebSocketManager(mainServer);
})
