const express = require('express');
const request = require('supertest');

jest.mock('../../../factories/controllerFactory', () => ({
    getAmazonS3Controller: () => ({
        getPresignedS3ProfilePicturebucketUrl: (req, res) => res.sendStatus(204),
    }),
}));

const amazonS3Router = require('../../../routes/AmazonS3Routes');

describe('AmazonS3Routes wiring (unit)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.use('/amazon', amazonS3Router);
    });

    it('POST /amazon/s3/ should call controller and return 204', async () => {
        const res = await request(app).post('/amazon/s3/');
        expect(res.status).toBe(204);
    });
});