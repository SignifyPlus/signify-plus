class CommonUtils {

    static async waitForVariableToBecomeNonNull(variableGetter, waitForTimeOut) {
        while(variableGetter() === null) {
            console.log(`Waiting`);
            await new Promise((resolve) => setTimeout(resolve, waitForTimeOut));
        }
        console.log("Done!");
        return variableGetter();
    }
}

module.exports = CommonUtils;