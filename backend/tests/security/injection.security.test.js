const request = require('supertest');
const app = require('../../tests/security/expressApp');

describe('🛡️ Injection Security Tests', () => {

    it('should not allow NoSQL injection via login route', async () => {
        const maliciousInput = {
            phoneNumber: { "$ne": null },
            password: "any-password"
        };
    
        const res = await request(app)
            .post('/users/phone')
            .send(maliciousInput);
    
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(500);
        expect(res.body).not.toHaveProperty('token');
    }, 10000);

    it('should sanitize query params to prevent NoSQL injection', async () => {
        const res = await request(app).get('/users?username[$ne]=admin');
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(500);
    });

    it('should reject $or operator in query', async () => {
        const res = await request(app).get('/users?phoneNumber[$or]=true');
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(500);
    });

    it('should not expose internal errors to the client', async () => {
        const res = await request(app)
            .get('/users?__proto__=malicious');
    
            expect(res.statusCode).not.toBe(500);
            expect(res.text.toLowerCase()).not.toMatch(/stack trace|referenceerror|typeerror/);
    });

    it('should not crash on escaped characters', async () => {
        const payload = {
            phoneNumber: "\\$ne\\",
            password: "\\n\\t"
        };
    
        const res = await request(app)
            .post('/users/phone')
            .send(payload);
    
        expect(res.statusCode).not.toBe(500);
    });

    it('should sanitize user inputs to prevent XSS', async () => {
        const payload = {
            phoneNumber: "<script>alert('xss')</script>",
            password: "safePassword123"
        };
    
        const res = await request(app)
        .post('/users/phone')
        .send(payload);
    
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(500);
        expect(res.body).not.toContain("<script>");
    },10000);

    it('should handle malformed JSON without crashing', async () => {
        const res = await request(app)
            .post('/users/phone')
            .set('Content-Type', 'application/json')
            .send('{"phoneNumber": "abc"'); //missing curly brace
    
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

});