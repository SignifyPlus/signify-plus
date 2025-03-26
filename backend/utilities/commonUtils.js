const LoggerManager = require('../managers/loggerManager.js');
class CommonUtils {
    static async waitForVariableToBecomeNonNull(getterFunction, waitForTimeOut = 1000) {
        while(getterFunction() === null) {
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
}
module.exports = CommonUtils;