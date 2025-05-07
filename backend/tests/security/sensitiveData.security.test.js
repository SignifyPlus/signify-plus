const request = require('supertest');
const app = require('./expressApp');

describe('Sensitive Data Security Test', () => {
    const importantPaths = [
        '/', 
        '/users/all', 
        '/contacts/all', 
        '/chats', 
        '/messages', 
        '/forums', 
        '/forumMembers', 
        '/threads', 
        '/comments', 
        '/settings',
        '/nonexistent'
    ];

    it.each(importantPaths)('should not expose stack trace for %s', async (path) => {
        const res = await request(app).get(path);

        if (res.status >= 400) { 
        expect(res.text).not.toMatch(/at\s+\S+\s+\(/);
        expect(res.text).not.toMatch(/\/Users\/|\/node_modules\//);
        }
    });

    it.each(importantPaths)('should not leak environment variables in %s', async (path) => {
        const res = await request(app).get(path);

        const text = JSON.stringify(res.body);
        expect(text).not.toMatch(/MONGO_DB_URL|PORT|EMAIL|RENDER_URL|FIRE_BASE_AUTHENTICATION_CREDS|FIRE_BASE_ENCODED_REST_API_KEY|FIRE_BASE_REST_API|CLOUD_AMQP_RABBIT_MQ_HOST_URL/i);
    });
});