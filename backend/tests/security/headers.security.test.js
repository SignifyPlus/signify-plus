const request = require('supertest');
const app = require('./expressApp');

describe('Security Headers Test', () => {
    const routesToTest = [
        '/',
        '/users/all',
        '/contacts',
        '/chats',
        '/messages',
        '/forums',
        '/forumMembers',
        '/threads',
        '/comments',
        '/settings',
        '/nonexistent',
    ];

    it.each(routesToTest)('should not have X-Powered-By header for %s', async (route) => {
        const res = await request(app).get(route);
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('should have Content-Type application/json for /users/all route', async () => {
        const res = await request(app).get('/users/all');
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 404 with no server leaks for invalid routes', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.status).toBe(404);
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});