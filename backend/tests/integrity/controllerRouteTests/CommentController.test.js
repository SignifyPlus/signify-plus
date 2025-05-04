const request = require('supertest');
const express = require('express');
const CommentController = require('../../../controllers/CommentController');
const ServiceFactory = require('../../../factories/serviceFactory');

describe('CommentController Integrity Test', () => {
    let app;
    let controller;
    let mockResponse;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        controller = new CommentController();

        jest.spyOn(ServiceFactory.getCommentService, 'getDocuments');

        app.get('/comments', controller.getAllComments);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all comments successfully', async () => {
        const mockComments = [
        { id: '1', content: 'First comment' },
        { id: '2', content: 'Second comment' }
        ];

        ServiceFactory.getCommentService.getDocuments.mockResolvedValue(mockComments);

        const res = await request(app).get('/comments');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockComments);
        expect(ServiceFactory.getCommentService.getDocuments).toHaveBeenCalled();
    });

    it('should return 500 if service throws error', async () => {
        ServiceFactory.getCommentService.getDocuments.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/comments');

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'DB error');
        expect(ServiceFactory.getCommentService.getDocuments).toHaveBeenCalled();
    });
});