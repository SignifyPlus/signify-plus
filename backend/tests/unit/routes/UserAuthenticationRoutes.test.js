const express = require('express');
const request = require('supertest');

jest.mock('../../../exception/ExceptionHelper.js', () => ({
    validate: jest.fn(),
}));
jest.mock('../../../factories/controllerFactory.js', () => ({
    getUserAuthenticationController: jest.fn(),
}));

const ExceptionHelper = require('../../../exception/ExceptionHelper.js');
const ControllerFactory = require('../../../factories/controllerFactory.js');

describe('UserAuthenticationRoutes (unit)', () => {
    let app;
    let getRecordMock, createRecordMock, updateRecordMock;

    beforeAll(() => {
        getRecordMock = jest.fn((req, res) => res.status(200).json({ ok: true }));
        createRecordMock = jest.fn((req, res) => res.status(201).json({ created: true }));
        updateRecordMock = jest.fn((req, res) => res.status(200).json({ updated: true }));

        ControllerFactory.getUserAuthenticationController.mockReturnValue({
            getUserAuthenticationRecord: getRecordMock,
            createUserAuthenticationRecord: createRecordMock,
            updateUserAuthenticationRecord: updateRecordMock,
        });

        const router = require('../../../routes/UserAuthenticationRoutes');
        app = express().use(express.json()).use('/uauth', router);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /uauth/ should return 400 when phoneNumber missing', async () => {
        ExceptionHelper.validate.mockImplementation((doc, status, msg, res) =>
            res.status(status).json({ Message: msg })
        );
        const res = await request(app).get('/uauth/');
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            null,
            400,
            'phoneNumber query parameter is required!',
            expect.any(Object)
        );
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ Message: 'phoneNumber query parameter is required!' });
    });

    it('GET /uauth/:phoneNumber should delegate to controller.getUserAuthenticationRecord', async () => {
        const res = await request(app).get('/uauth/+1234567890');
        expect(getRecordMock).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });

    it('POST /uauth/create/ should delegate to controller.createUserAuthenticationRecord', async () => {
        const res = await request(app).post('/uauth/create/').send({ phoneNumber: '+123', refreshToken: 'tok' });
        expect(createRecordMock).toHaveBeenCalled();
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ created: true });
    });

    it('PUT /uauth/update/ should delegate to controller.updateUserAuthenticationRecord', async () => {
        const res = await request(app).put('/uauth/update/').send({ phoneNumber: '+123', isVerified: true });
        expect(updateRecordMock).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ updated: true });
    });
});