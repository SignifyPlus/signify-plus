const express = require('express');
const request = require('supertest');

jest.mock('../../../exception/ExceptionHelper.js');
jest.mock('../../../factories/controllerFactory.js', () => ({
    getJwtController: jest.fn().mockReturnValue({ validateTokens: (req, res) => res.sendStatus(501) }),
}));

const ExceptionHelper = require('../../../exception/ExceptionHelper.js');
const ControllerFactory = require('../../../factories/controllerFactory.js');

describe('JwtRoutes (unit)', () => {
    let app;

    beforeAll(() => {
        // For GET test, we can use a static router import as it does not depend on controller mocking.
        const jwtRouter = require('../../../routes/JwtRoutes');
        app = express().use(express.json()).use('/jwt', jwtRouter);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('GET /jwt/ should invoke ExceptionHelper.validate and return its response', async () => {
        ExceptionHelper.validate.mockImplementation((doc, status, msg, res) => {
            return res.status(status).json({ Message: msg });
        });

        const res = await request(app).get('/jwt/');
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            null,
            400,
            'Invalid path',
            expect.any(Object)
        );
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ Message: 'Invalid path' });
    });

    it('POST /jwt/validate/ should call JwtController.validateTokens', async () => {
        const validateTokens = jest.fn((req, res) => res.status(202).json({ ok: true }));
        ControllerFactory.getJwtController.mockReturnValue({ validateTokens });

        let server;
        jest.isolateModules(() => {
            const express = require('express');
            const jwtRouter = require('../../../routes/JwtRoutes');
            const app = express().use(express.json()).use('/jwt', jwtRouter);
            server = app;
        });

        const res = await request(server).post('/jwt/validate/').send({});
        expect(validateTokens).toHaveBeenCalled();
        expect(res.status).toBe(202);
        expect(res.body).toEqual({ ok: true });
    });
});