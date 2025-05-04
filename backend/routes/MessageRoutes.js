const express = require('express');
const messageRouter = express.Router();
const ControllerFactory = require('../factories/controllerFactory.js');

messageRouter.post(
   '/create',
   ControllerFactory.getMessageController().postMessage,
);

messageRouter.delete(
   '/delete',
   ControllerFactory.getMessageController().deleteMessage,
);

// New Routes
messageRouter.put(
   '/edit',
   ControllerFactory.getMessageController().editMessage,
);

messageRouter.post(
   '/forward',
   ControllerFactory.getMessageController().forwardMessage,
);

messageRouter.post('/pin', ControllerFactory.getMessageController().pinMessage);

messageRouter.post(
   '/read-status',
   ControllerFactory.getMessageController().toggleMessageReadStatus,
);

messageRouter.get(
   '/unread-count/:userPhoneNumber',
   ControllerFactory.getMessageController().getUnreadMessageCount,
);

messageRouter.get(
   '/unread-count/:userPhoneNumber/:chatId',
   ControllerFactory.getMessageController().getUnreadMessageCount,
);

messageRouter.get(
   '/replies/:messageId',
   ControllerFactory.getMessageController().getMessageReplies,
);

module.exports = messageRouter;
