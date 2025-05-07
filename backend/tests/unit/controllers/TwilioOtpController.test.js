const TwilioOtpController = require('../../../controllers/TwilioOtpController');
const ServiceFactory = require('../../../factories/serviceFactory');
const ManagerFactory = require('../../../factories/managerFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const LoggerFactory = require('../../../factories/loggerFactory');
const SignifyException = require('../../../exception/SignifyException');
const EventDispatcher = require('../../../events/eventDispatcher');
const EventConstants = require('../../../constants/eventConstants');
const ControllerConstants = require('../../../constants/controllerConstants');

jest.mock('../../../factories/serviceFactory');
jest.mock('../../../factories/managerFactory');
jest.mock('../../../exception/ExceptionHelper');
jest.mock('../../../factories/loggerFactory');
jest.mock('../../../exception/SignifyException');
jest.mock('../../../events/eventDispatcher');

describe('TwilioOtpController (unit)', () => {
    let controller, req, res;
    let mockUserSvc, mockMgr, mockClient;

    beforeEach(() => {
        controller = new TwilioOtpController();
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json:   jest.fn(),
        };

        mockUserSvc = { getDocumentByCustomFilters: jest.fn() };
        ServiceFactory.getUserService = mockUserSvc;
        ExceptionHelper.validate = jest.fn();
        LoggerFactory.getApplicationLogger = { info: jest.fn(), error: jest.fn() };
        SignifyException.mockImplementation((status, msg) => ({
            status,
            loadResult: () => ({ error: msg }),
        }));

        EventDispatcher.dispatchEvent = jest.fn();

        mockClient = {
        verify: {
            v2: {
            services: jest.fn().mockReturnThis(),
            verifications: { create: jest.fn() },
            verificationChecks: { create: jest.fn() },
            },
        },
        };
        mockMgr = {
            getTwilioClient: mockClient,
            getTwilioVerifyServiceDto: { serviceSid: 'sid' },
        };
        ManagerFactory.getTwilioManager = jest.fn().mockReturnValue(mockMgr);
    });

    describe('getOtp', () => {
        it('returns early 400 if user not found', async () => {
        req.params.phoneNumber = '+100';
        mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce(null);
        ExceptionHelper.validate.mockResolvedValueOnce('early');
        const result = await controller.getOtp(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            null, 400, 'User does not exist in the database', res
        );
        expect(result).toBe('early');
        });

        it('returns otp status on success', async () => {
        req.params.phoneNumber = '+100';
        mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
        ExceptionHelper.validate.mockResolvedValueOnce(null);
        mockClient.verify.v2.verifications.create.mockResolvedValueOnce({ valid: true, status: 'pending' });

        await controller.getOtp(req, res);

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ valid: true, status: 'pending' });
        });

        it('handles exceptions and returns 500', async () => {
        req.params.phoneNumber = '+100';
        mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
        ExceptionHelper.validate.mockResolvedValueOnce(null);
        mockClient.verify.v2.verifications.create.mockRejectedValueOnce(new Error('fail'));

        await controller.getOtp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
        });
    });

    describe('verifyOtp', () => {
            it('returns 400 if otpCode missing', async () => {
            req.body = {};
            ExceptionHelper.validate.mockResolvedValueOnce('err1');
            const result = await controller.verifyOtp(req, res);
            expect(ExceptionHelper.validate).toHaveBeenCalledWith(
                undefined, 400, 'otpCode from the body is missing.', res
            );
            expect(result).toBe('err1');
            });

            it('returns 400 if phoneNumber missing', async () => {
            req.body = { otpCode: '1234' };
            ExceptionHelper.validate
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce('err2');
            const result = await controller.verifyOtp(req, res);
            expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
                2, undefined, 400, 'phoneNumber from the body is missing.', res
            );
            expect(result).toBe('err2');
            });

            it('returns 400 if user not found', async () => {
            req.body = { phoneNumber: '+100', otpCode: '1234' };
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce(null);
            ExceptionHelper.validate.mockResolvedValueOnce('userErr');
            const result = await controller.verifyOtp(req, res);
            expect(mockUserSvc.getDocumentByCustomFilters)
                .toHaveBeenCalledWith({ phoneNumber: '+100' });
            expect(ExceptionHelper.validate).toHaveBeenLastCalledWith(
                null, 400, 'User does not exist in the database', res
            );
            expect(result).toBe('userErr');
            });

            it('returns 400 on invalid OTP', async () => {
            req.body = { phoneNumber: '+100', otpCode: '0000' };
            ExceptionHelper.validate.mockResolvedValue(null);
            mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
            mockClient.verify.v2.verificationChecks.create.mockResolvedValueOnce({ valid: false, status: 'expired' });

            await controller.verifyOtp(req, res);

            expect(SignifyException).toHaveBeenCalledWith(400, 'Invalid OTP code - twilio status: expired.');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid OTP code - twilio status: expired.' });
            });

            it('dispatches event and returns valid on success', async () => {
            req.body = { phoneNumber: '+100', otpCode: '1234' };
            ExceptionHelper.validate.mockResolvedValue(null);
            mockUserSvc.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'u1' });
            mockClient.verify.v2.verificationChecks.create.mockResolvedValueOnce({ valid: true, status: 'approved' });

            await controller.verifyOtp(req, res);

            expect(EventDispatcher.dispatchEvent).toHaveBeenCalledWith(
                EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
                { userId: 'u1', isVerified: true }
            );
            expect(res.json).toHaveBeenCalledWith({ valid: true, status: 'approved' });
            });
    });
});