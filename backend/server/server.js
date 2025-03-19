require("dotenv").config();
require("reflect-metadata");
const { injectable, inject } = require('inversify');
const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const WebSocketManager = require("../managers/websocketManager.js");
const EventFactory = require("../factories/eventFactory.js");
const ManagerFactory = require("../factories/managerFactory.js");
const userRoutes = require("../routes/UserRoutes.js");
const homeRoutes = require("../routes/HomeRoute.js");
const contactRoutes = require("../routes/ContactRoutes.js");
const chatRoutes = require("../routes/ChatRoutes.js");
const messageRoutes = require("../routes/MessageRoutes.js");
const Encrypt = require("../utilities/encrypt.js");
const MessageEvent = require("../events/services/messageEvent.js");
const EventDispatcher = require("../events/eventDispatcher.js");

const signifyPlusApp = express();
signifyPlusApp.use(express.json());
const mainServer = http.createServer(signifyPlusApp);

const mongoDburl = process.env.MONGO_DB_URL;
const port = process.env.PORT;

//routes
signifyPlusApp.use('/users', userRoutes);
signifyPlusApp.use('/', homeRoutes);
signifyPlusApp.use('/contacts', contactRoutes);
signifyPlusApp.use('/chats', chatRoutes);
signifyPlusApp.use('/messages', messageRoutes);

//setup Server
setupServer();
//connect to the database
connectToMongoDB();

mainServer.listen(port, () => {
    console.log("Server is Running")
    const websocketManager = new WebSocketManager(mainServer);
})

async function setupServer() {
    try {
        //initialize RabbitMQ
        await ManagerFactory.getRabbitMqQueueManager().establishConnection();
        //initialzie Event Dispatcher
        EventFactory.setEventDispatcher = new EventDispatcher();
        EventFactory.setMessageEvent = new MessageEvent(EventFactory.getEventDispatcher);
        //setup processors, if any
        await ManagerFactory.getRabbitMqProcessorManager().executeMessageProcessor(ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel());
        //use these for reading connecting string from firebase
    }catch(exception) {
        console.log(`Exception Occured ${exception}`);
        throw new Error(exception);
    }
}

async function connectToMongoDB() {
    try {
        //connect to the database now
        await mongoose.connect(mongoDburl).then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
    }catch(exception) {
        console.log(`Exception Occured ${exception}`);
        throw new Error(exception);
    }
}