const TwilioManager = require('../../../../managers/twilio/twilioManager');
const LoggerFactory = require('../../../../factories/loggerFactory');
const Twilio = require('twilio');
const TwilioVerifyServiceDto = require('../../../../managers/twilio/models/TwilioVerifyService');

jest.mock('../../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), error: jest.fn() },
}));

jest.mock('twilio', () => jest.fn());

jest.mock('../../../../managers/twilio/models/TwilioVerifyService', () => {
    return jest.fn().mockImplementation((serviceId) => ({
        serviceSid: serviceId,
    }));
});

describe('TwilioManager', () => {
    let manager;
    beforeEach(() => {
        jest.clearAllMocks();
        manager = new TwilioManager();
    });

    describe('initializeTwilioClient', () => {
        it('should initialize Twilio client with decrypted credentials and log info', async () => {
            const fakeClient = { send: jest.fn() };
            Twilio.mockReturnValue(fakeClient);

            const twilioAdminDto = {
                getDecryptedAccountSid: jest.fn().mockResolvedValue('AC123'),
                getDecryptedAuthToken: jest.fn().mockResolvedValue('AUTH456'),
            };

            await manager.initializeTwilioClient(twilioAdminDto);

            expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
                'Initializing Twilio Client...'
            );
            expect(Twilio).toHaveBeenCalledWith('AC123', 'AUTH456');
            expect(manager.getTwilioClient).toBe(fakeClient);
        });
    });

    describe('setTwilioVerifyServiceDto', () => {
            it('should set and return the TwilioVerifyServiceDto instance', async () => {
                const serviceId = 'serviceXYZ';
                await manager.setTwilioVerifyServiceDto(serviceId);

                expect(TwilioVerifyServiceDto).toHaveBeenCalledWith(serviceId);
                const dto = manager.getTwilioVerifyServiceDto;
                expect(dto).toHaveProperty('serviceSid', serviceId);
            });
    });
});