const CommonConstants = require('../constants/commonConstants.js');
const LoggerManager = require('../managers/loggerManager.js');
class CommonUtils {
   static async waitForVariableToBecomeNonNull(
      getterFunction,
      waitForTimeOut = 1000,
   ) {
      while (getterFunction() === null) {
         await new Promise((resolve) => setTimeout(resolve, waitForTimeOut));
      }
      return getterFunction();
   }

   static async isValueNull(valueToCheck) {
      if (valueToCheck === undefined || valueToCheck === null) {
         return true;
      }
      return false;
   }

   static async getLogger(logLevel) {
      return new LoggerManager().createLogger(logLevel);
   }

   static async decodeFromBase64(base64EncodedString) {
      return Buffer.from(base64EncodedString, CommonConstants.BASE_64).toString(
         CommonConstants.BUFFER_ENCODING,
      );
   }
}
module.exports = CommonUtils;
