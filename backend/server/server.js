require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const http = require('http');
const WebSocketManager = require('../managers/websocketManager.js');
const EventFactory = require('../factories/eventFactory.js');
const ManagerFactory = require('../factories/managerFactory.js');
const MessageEvent = require('../events/services/messageEvent.js');
const AccessibilitySettingsEvent = require('../events/services/accessibilitySettingsEvent.js');
const UserAuthenticationEvent = require('../events/services/userAuthenticationEvent.js');
const UserEvent = require('../events/services/userEvent.js');
const ServiceFactory = require('../factories/serviceFactory.js');
const CommonUtils = require('../utilities/commonUtils.js');
const ServerConstants = require('../constants/serverConstants.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const TwilioAdmin = require('../managers/twilio/models/TwilioAdmin.js');

//routes
const userRoutes = require('../routes/UserRoutes.js');
const homeRoutes = require('../routes/HomeRoute.js');
const contactRoutes = require('../routes/ContactRoutes.js');
const chatRoutes = require('../routes/ChatRoutes.js');
const messageRoutes = require('../routes/MessageRoutes.js');
const forumRoutes = require('../routes/ForumRoutes.js');
const forumMemberRoutes = require('../routes/ForumMemberRoutes.js');
const threadRoutes = require('../routes/ThreadRoutes.js');
const commentRoutes = require('../routes/CommentRoutes.js');
const settingsRoutes = require('../routes/SettingsRoutes.js');
const userAuthenticationRoutes = require('../routes/UserAuthenticationRoutes.js');
const twilioOtpRoutes = require('../routes/TwilioVerifyRoutes.js');

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
      `SignifyPlus Server is Up & Running on http://localhost:${port}`,
   );
   const websocketManager = new WebSocketManager(mainServer);
});

async function setupServer() {
   try {
      //initialize RabbitMQ
      await ManagerFactory.getRabbitMqQueueManager().establishConnection();
      //setup message event
      EventFactory.setMessageEvent = new MessageEvent();
      EventFactory.setAccessibilitySettingsEvent =
         new AccessibilitySettingsEvent();
      EventFactory.setUserEvent = new UserEvent();
      EventFactory.setUserAuthenticationEvent = new UserAuthenticationEvent();
      //setup processors, if any
      await ManagerFactory.getRabbitMqProcessorManager().executeMessageProcessor(
         ManagerFactory.getRabbitMqQueueManager().getRabbitMqChannel(),
      );

      //setup Amazon S3 Manager
      //dont await, let it run on a separate thread
      //as it wont be needed immediately
      await ManagerFactory.getAwsS3Manager().initiateS3Connection();
      //Twilio OTP/Verify
      await setupTwilio();
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
      signifyPlusAppServer.use('/threads', threadRoutes);
      signifyPlusAppServer.use('/comments', commentRoutes);
      signifyPlusAppServer.use('/settings', settingsRoutes);
      signifyPlusAppServer.use('/userAuthentication', userAuthenticationRoutes);
      signifyPlusAppServer.use('/twilio', twilioOtpRoutes);
   } catch (exception) {
      LoggerFactory.getApplicationLogger.error(
         `Exception Occured ${exception}`,
      );
      throw new Error(exception);
   }
}

async function setupTwilio() {
   await ManagerFactory.getTwilioManager().initializeTwilioClient(
      new TwilioAdmin(
         process.env.TWILIO_ACCOUNT_SID_ENCRYPTED,
         process.env.TWILIO_ACCOUNT_AUTH_TOKEN_ENCRYPTED,
      ),
   );
   await ManagerFactory.getTwilioManager().setTwilioVerifyServiceDto(
      process.env.TWILIO_VERIFY_SERVICE_SID,
   );
}

async function setupApplicationLogger(logLevel) {
   const logger = await CommonUtils.getLogger(logLevel);
   LoggerFactory.setApplicationLogger = logger;
}

function getApplicationLogger() {
   return LoggerFactory.getApplicationLogger;
}
