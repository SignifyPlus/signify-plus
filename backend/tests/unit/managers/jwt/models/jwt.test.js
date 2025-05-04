const JWT = require('../../../../../managers/jwt/models/jwt');

describe('JWT Model', () => {
    it('should correctly assign constructor parameters', () => {
        const accessSecret = 'access-secret';
        const refreshSecret = 'refresh-secret';
        const accessExpiry = '15m';
        const refreshExpiry = '7d';

        const jwt = new JWT(accessSecret, refreshSecret, accessExpiry, refreshExpiry);

        expect(jwt.accessTokenSecret).toBe(accessSecret);
        expect(jwt.refreshTokenSecret).toBe(refreshSecret);
        expect(jwt.accessTokenExpirationTime).toBe(accessExpiry);
        expect(jwt.refreshTokenExpirationTime).toBe(refreshExpiry);
    });

    it('should allow different values for all fields', () => {
        const accessSecret = 'another-access';
        const refreshSecret = 'another-refresh';
        const accessExpiry = '30s';
        const refreshExpiry = '14d';

        const jwt = new JWT(accessSecret, refreshSecret, accessExpiry, refreshExpiry);

        expect(jwt).toMatchObject({
            accessTokenSecret: accessSecret,
            refreshTokenSecret: refreshSecret,
            accessTokenExpirationTime: accessExpiry,
            refreshTokenExpirationTime: refreshExpiry,
        });
    });
});