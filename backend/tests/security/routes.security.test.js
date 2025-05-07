const request = require('supertest');
const app = require('./expressApp');

describe('Routes Availability Test', () => {
  const routes = [
    { path: '/', expectedStatus: 200 },
    { path: '/users/all', expectedStatus: 200 },
    { path: '/contacts/all', expectedStatus: 200 },
    { path: '/chats/+90123456', expectedStatus: 200 },
    { path: '/messages', expectedStatus: 200 },
    { path: '/forums/all', expectedStatus: 200 },
    { path: '/forumMembers/all', expectedStatus: 200 },
    { path: '/threads/all', expectedStatus: 200 },
    { path: '/comments/all', expectedStatus: 200 },
    { path: '/settings/id/:1', expectedStatus: 200 },
    { path: '/nonexistent', expectedStatus: 404 },
  ];

  it.each(routes)('should return $expectedStatus for $path', async ({ path, expectedStatus }) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(expectedStatus);
  });
});