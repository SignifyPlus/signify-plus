const express = require('express');
const request = require('supertest');

jest.mock('../../../exception/ExceptionHelper.js');
jest.mock('../../../factories/controllerFactory.js', () => ({
    getTwilioOtpController: jest.fn(),
}));

const ExceptionHelper = require('../../../exception/ExceptionHelper.js');
const ControllerFactory = require('../../../factories/controllerFactory.js');

describe('TwilioVerifyRoutes (unit)', () => {
    let app;
    let getOtpMock;
    let verifyOtpMock;

    beforeAll(() => {
        getOtpMock = jest.fn((req, res) => res.sendStatus(204));
        verifyOtpMock = jest.fn((req, res) => res.sendStatus(202));

        ControllerFactory.getTwilioOtpController.mockReturnValue({
            getOtp: getOtpMock,
            verifyOtp: verifyOtpMock,
        });

        const twilioVerifyRouter = require('../../../routes/TwilioVerifyRoutes');
        app = express().use(express.json()).use('/twilio', twilioVerifyRouter);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /twilio/ should return 400 when phoneNumber missing', async () => {
        ExceptionHelper.validate.mockImplementation((doc, status, msg, res) => {
            return res.status(status).json({ Message: msg });
        });

        const res = await request(app).get('/twilio/');
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            null,
            400,
            'phoneNumber query parameter is required!',
            expect.any(Object)
        );
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ Message: 'phoneNumber query parameter is required!' });
    });

    it('GET /twilio/getOtp/:phoneNumber should delegate to controller.getOtp', async () => {
        const res = await request(app).get('/twilio/getOtp/+1234567890');
        expect(getOtpMock).toHaveBeenCalled();
        expect(res.status).toBe(204);
    });

    it('POST /twilio/verifyOtp should delegate to controller.verifyOtp', async () => {
        const res = await request(app).post('/twilio/verifyOtp').send({ phoneNumber: '+123', otpCode: '0000' });
        expect(verifyOtpMock).toHaveBeenCalled();
        expect(res.status).toBe(202);
    });
});