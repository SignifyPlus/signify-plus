class CommonUtils {
    static async waitForVariableToBecomeNonNull(getterFunction, waitForTimeOut = 1000) {
        while(getterFunction() === null) {
            await new Promise((resolve) => setTimeout(resolve, waitForTimeOut));
        }
        return getterFunction();
    }
}
module.exports = CommonUtils;