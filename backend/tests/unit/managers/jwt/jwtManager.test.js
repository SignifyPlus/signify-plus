const JwtManager = require('../../../../managers/jwt/jwtManager');
const JsonWebToken = require('jsonwebtoken');
const LoggerFactory = require('../../../../factories/loggerFactory');
const SignifyResult = require('../../../../dtos/SignifyResult');

jest.mock('jsonwebtoken');

jest.mock('../../../../factories/loggerFactory.js', () => ({
    getApplicationLogger: { info: jest.fn(), error: jest.fn() },
}));

describe('JwtManager', () => {
    let manager;
    const accessSecret  = 'access-secret';
    const refreshSecret = 'refresh-secret';
    const accessExp     = '10s';
    const refreshExp    = '7d';

    beforeEach(async () => {

        manager = new JwtManager();
        await manager.setJwtDto(accessSecret, refreshSecret, accessExp, refreshExp);

        JsonWebToken.sign.mockClear();
        JsonWebToken.verify.mockClear();
        LoggerFactory.getApplicationLogger.info.mockClear();
        LoggerFactory.getApplicationLogger.error.mockClear();
    });

    describe('setJwtDto', () => {
        it('does not create dto if a parameter is missing', async () => {
            const m2 = new JwtManager();
            await m2.setJwtDto(accessSecret, refreshSecret, accessExp, null);
            await expect(m2.generateAccessToken('uid')).rejects.toThrow();
        });
    });

    describe('generateAccessToken', () => {
        it('signs and returns an access token', async () => {
            JsonWebToken.sign.mockReturnValue('token-123');
            const token = await manager.generateAccessToken('user1');
            expect(JsonWebToken.sign).toHaveBeenCalledWith(
                { userId: 'user1' },
                accessSecret,
                { expiresIn: accessExp }
            );
            expect(token).toBe('token-123');
            expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('AccessToken:')
            );
        });
    });

    describe('generateRefreshToken', () => {
        it('signs and returns a refresh token', async () => {
            JsonWebToken.sign.mockReturnValue('refresh-456');
            const token = await manager.generateRefreshToken('user2');
            expect(JsonWebToken.sign).toHaveBeenCalledWith(
                { userId: 'user2' },
                refreshSecret,
                { expiresIn: refreshExp }
            );
            expect(token).toBe('refresh-456');
            expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('RefreshToken:')
            );
        });
    });

    describe('verifyAccessToken', () => {
        it('returns SignifyResult with data when valid', async () => {
            const payload = { userId: 'u1' };
            JsonWebToken.verify.mockReturnValue(payload);
            const result = await manager.verifyAccessToken('atoken');
            expect(JsonWebToken.verify).toHaveBeenCalledWith('atoken', accessSecret);
            expect(result).toBeInstanceOf(SignifyResult);
            expect(result.data).toEqual(payload);
            expect(result.exception).toBeNull();
            expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('IsAccessTokenValid:')
            );
        });

        it('returns SignifyResult with exception when invalid', async () => {
            const error = new Error('bad token');
            JsonWebToken.verify.mockImplementation(() => { throw error; });
            const result = await manager.verifyAccessToken('bad-token');
            expect(result).toBeInstanceOf(SignifyResult);
            expect(result.data).toBeNull();
            expect(result.exception).toBe(error);
            expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Exception Occured while verifying the access token:')
            );
        });
    });

    describe('verifyRefreshToken', () => {
        it('returns SignifyResult with data when valid', async () => {
            const payload = { userId: 'u2' };
            JsonWebToken.verify.mockReturnValue(payload);
            const result = await manager.verifyRefreshToken('rtoken');
            expect(JsonWebToken.verify).toHaveBeenCalledWith('rtoken', refreshSecret);
            expect(result.data).toEqual(payload);
            expect(result.exception).toBeNull();
            expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('IsRefreshTokenValid:')
            );
        });

        it('returns SignifyResult with exception when invalid', async () => {
            const error = new Error('expired');
            JsonWebToken.verify.mockImplementation(() => { throw error; });
            const result = await manager.verifyRefreshToken('expired-token');
            expect(result.data).toBeNull();
            expect(result.exception).toBe(error);
            expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Exception Occured while verifying the refresh token:')
            );
        });
    });
});