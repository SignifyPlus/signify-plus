const EventConstants = require('../../constants/eventConstants.js');
const ControllerFactory = require('../../factories/controllerFactory.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const EventDispatcher = require('../eventDispatcher.js');
class CallLogEvent {
   constructor() {
      EventDispatcher.registerListener(
         EventConstants.CALL_LOG_EVENT,
         this.logCallRecord.bind(this),
      );
   }

   async logCallRecord(callLogDto) {
      LoggerFactory.getApplicationLogger.info(
         `Logging call record data ${JSON.stringify(callLogDto)} via the call log event...`,
      );
      const response =
         await ControllerFactory.getCallHistoryController().logCallRecord(
            callLogDto,
         );
      return response;
   }
}

module.exports = CallLogEvent;
