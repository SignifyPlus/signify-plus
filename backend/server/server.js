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
const EventDispatcher = require("../events/eventDispatcher.js");
const MessageEvent = require("../events/services/messageEvent.js");

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

//initialize RabbitMQ
ManagerFactory.getRabbitMqQueueManager.establishConnection();
//initialzie Event Dispatcher
EventFactory.setEventDispatcher = new EventDispatcher();
//setup events
EventFactory.setMessageEvent = new MessageEvent(EventFactory.getEventDispatcher);
//use these for reading connecting string from firebase
mongoose.connect(mongoDburl).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

mainServer.listen(port, () => {
    console.log("Server is Running")
    const websocketManager = new WebSocketManager(mainServer);
})
