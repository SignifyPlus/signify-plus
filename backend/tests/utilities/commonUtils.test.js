const CommonUtils = require("../../utilities/commonUtils");

describe("CommonUtils.waitForVariableToBecomeNonNull", () => {
    it("should return immediately if the getter returns a non-null value", async () => {
        const getterFunction = () => "immediate value";
        const result = await CommonUtils.waitForVariableToBecomeNonNull(getterFunction, 10);
        expect(result).toBe("immediate value");
    });

    it("should wait until the getter returns a non-null value", async () => {
        let value = null;
        const getterFunction = () => value;
        
        setTimeout(() => {
        value = "delayed value";
        }, 50);
        
        const result = await CommonUtils.waitForVariableToBecomeNonNull(getterFunction, 10);
        expect(result).toBe("delayed value");
    });
});