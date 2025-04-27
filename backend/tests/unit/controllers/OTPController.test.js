const OTPController = require('../../../controllers/OTPController');

describe('OTPController Unit Test', () => {
    it('should instantiate the OTPController class', () => {
        const otpController = new OTPController();
        expect(otpController).toBeInstanceOf(OTPController);
    });
});