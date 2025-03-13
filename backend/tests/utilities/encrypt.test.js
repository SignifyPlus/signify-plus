const bcrypt = require("bcrypt");
const Encrypt = require("../../utilities/encrypt"); 

describe("Encrypt class", () => {
    const SALT_ROUNDS = 5; 
    const TEST_STRING = "mySecret";

    it("should create a hashed value that is not the same as the original string", async () => {
        const encryptInstance = new Encrypt(SALT_ROUNDS);
        const hashedValue = await encryptInstance.encrypt(TEST_STRING);

        expect(hashedValue).toBeDefined();
        expect(typeof hashedValue).toBe("string");
        expect(hashedValue).not.toBe(TEST_STRING);
    });

    it("should create a valid hash that can be verified with bcrypt.compare", async () => {
        const encryptInstance = new Encrypt(SALT_ROUNDS);
        const hashedValue = await encryptInstance.encrypt(TEST_STRING);

        // Compare the original string with the generated hash
        const isMatch = await bcrypt.compare(TEST_STRING, hashedValue);
        expect(isMatch).toBe(true);
    });
});