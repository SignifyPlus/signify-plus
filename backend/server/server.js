require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const http = require('http');
const WebSocketManager = require('../managers/websocketManager.js');
const EventFactory = require('../factories/eventFactory.js');
const ManagerFactory = require('../factories/managerFactory.js');
const userRoutes = require('../routes/UserRoutes.js');
const homeRoutes = require('../routes/HomeRoute.js');
const contactRoutes = require('../routes/ContactRoutes.js');
const chatRoutes = require('../routes/ChatRoutes.js');
const messageRoutes = require('../routes/MessageRoutes.js');
const forumRoutes = require('../routes/ForumRoutes.js');
const forumMemberRoutes = require('../routes/ForumMemberRoutes.js');
const MessageEvent = require('../events/services/messageEvent.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const CommonUtils = require('../utilities/commonUtils.js');
const ServerConstants = require('../constants/serverConstants.js');
const LoggerFactory = require('../factories/loggerFactory.js');

const signifyPlusApp = express();
signifyPlusApp.use(express.json());
const mainServer = http.createServer(signifyPlusApp);

const mongoDburl = process.env.MONGO_DB_URL;
const port = process.env.PORT;

//setup a logger
setupApplicationLogger(ServerConstants.LOG_LEVEL_DEBUG);

//setup Server
setupServer();

//routes
setupApplicationRoutes(signifyPlusApp);

//connect to the database
ServiceFactory.getMongooseService.connectToMongoDB(mongoDburl);

mainServer.listen(port, async () => {
   await CommonUtils.waitForVariableToBecomeNonNull(getApplicationLogger);
   LoggerFactory.getApplicationLogger.info(
      `SignifyPlus Server is Up & Running`,
   );
   const websocketManager = new WebSocketManager(mainServer);
});

async function setupServer() {
   try {
      //initialize RabbitMQ
      await ManagerFactory.getRabbitMqQueueManager().establishConnection();
      //setup message event
      EventFactory.setMessageEvent = new MessageEvent();
      //setup processors, if any
      await ManagerFactory.getRabbitMqProcessorManager().executeMessageProcessor(
         ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel(),
      );
      //TODO Later
      //initiliaze firebase admin (for now not needed)
      //await ManagerFactory.getFirebaseManager().connectToFireBase(process.env.FIRE_BASE_AUTHENTICATION_CREDS);
   } catch (exception) {
      LoggerFactory.getApplicationLogger.error(
         `Exception Occured ${exception}`,
      );
      throw new Error(exception);
   }
}

function setupApplicationRoutes(signifyPlusAppServer) {
   try {
      signifyPlusAppServer.use('/users', userRoutes);
      signifyPlusAppServer.use('/', homeRoutes);
      signifyPlusAppServer.use('/contacts', contactRoutes);
      signifyPlusAppServer.use('/chats', chatRoutes);
      signifyPlusAppServer.use('/messages', messageRoutes);
      signifyPlusAppServer.use('/forums', forumRoutes);
      signifyPlusAppServer.use('/forumMembers', forumMemberRoutes);
   } catch (exception) {
      LoggerFactory.getApplicationLogger.error(
         `Exception Occured ${exception}`,
      );
      throw new Error(exception);
   }
}

async function setupApplicationLogger(logLevel) {
   const logger = await CommonUtils.getLogger(logLevel);
   LoggerFactory.setApplicationLogger = logger;
}

function getApplicationLogger() {
   return LoggerFactory.getApplicationLogger;
}
