const CommonUtils = require('../../../../../utilities/commonUtils');
const TwilioAdmin = require('../../../../../managers/twilio/models/TwilioAdmin');

jest.mock('../../../../../utilities/commonUtils', () => ({
    decodeFromBase64: jest.fn(),
}));

describe('TwilioAdmin', () => {
    const encodedSid = 'encodedSidValue';
    const encodedAuth = 'encodedAuthValue';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getDecryptedAccountSid should call decodeFromBase64 with accountSid and return the result', () => {
        const decodedSid = 'decodedSid';
        CommonUtils.decodeFromBase64.mockReturnValueOnce(decodedSid);

        const admin = new TwilioAdmin(encodedSid, encodedAuth);
        const result = admin.getDecryptedAccountSid();

        expect(CommonUtils.decodeFromBase64).toHaveBeenCalledWith(encodedSid);
        expect(result).toBe(decodedSid);
    });

    it('getDecryptedAuthToken should call decodeFromBase64 with authToken and return the result', () => {
        const decodedAuth = 'decodedAuth';
        CommonUtils.decodeFromBase64.mockReturnValueOnce(decodedAuth);

        const admin = new TwilioAdmin(encodedSid, encodedAuth);
        const result = admin.getDecryptedAuthToken();

        expect(CommonUtils.decodeFromBase64).toHaveBeenCalledWith(encodedAuth);
        expect(result).toBe(decodedAuth);
    });
});