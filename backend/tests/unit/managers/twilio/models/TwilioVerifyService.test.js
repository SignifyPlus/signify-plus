const TwilioVerifyService = require('../../../../../managers/twilio/models/TwilioVerifyService');

describe('TwilioVerifyService', () => {
    it('should correctly assign the serviceSid in the constructor', () => {
        const sid = 'SV12345';
        const svc = new TwilioVerifyService(sid);
        expect(svc.serviceSid).toBe(sid);
    });

    it('should allow different serviceSid values', () => {
        const sidOne = 'SERVICE_ONE';
        const svcOne = new TwilioVerifyService(sidOne);
        expect(svcOne.serviceSid).toBe('SERVICE_ONE');

        const sidTwo = 'SERVICE_TWO';
        const svcTwo = new TwilioVerifyService(sidTwo);
        expect(svcTwo.serviceSid).toBe('SERVICE_TWO');
    });
});