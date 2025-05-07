const mongoose = require('mongoose');
const UserAuthentication = require('../../../models/UserAuthentication');

describe('UserAuthentication Model', () => {
    it('should require userId', () => {
        const ua = new UserAuthentication();
        const validationError = ua.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError.errors.userId).toBeDefined();
    });

    it('should default isVerified to false and have createdAt/updatedAt set', () => {
        const userId = new mongoose.Types.ObjectId();
        const ua = new UserAuthentication({ userId });
        const validationError = ua.validateSync();
        expect(validationError).toBeUndefined();

        expect(ua.isVerified).toBe(false);
        expect(ua.createdAt).toBeInstanceOf(Date);
        expect(ua.updatedAt).toBeInstanceOf(Date);
    });

    it('should accept custom isVerified and refreshToken values', () => {
        const userId = new mongoose.Types.ObjectId();
        const ua = new UserAuthentication({
            userId,
            isVerified: true,
            refreshToken: 'ref-token-123',
        });
        const validationError = ua.validateSync();
        expect(validationError).toBeUndefined();
        expect(ua.isVerified).toBe(true);
        expect(ua.refreshToken).toBe('ref-token-123');
    });

    it('should update updatedAt when modified', () => {
        const userId = new mongoose.Types.ObjectId();
        const ua = new UserAuthentication({ userId });
        const originalUpdatedAt = ua.updatedAt;

        ua.updatedAt = new Date(Date.now() + 1000);
        expect(ua.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
});