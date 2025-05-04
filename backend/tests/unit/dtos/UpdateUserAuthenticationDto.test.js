const UpdateUserAuthenticationDto = require('../../../dtos/UpdateUserAuthenticationDto');

describe('UpdateUserAuthenticationDto', () => {
    it('should correctly assign phoneNumber, isVerified, and refreshToken', () => {
        const phoneNumber = '+1234567890';
        const isVerified = true;
        const refreshToken = 'new-refresh-token';

        const dto = new UpdateUserAuthenticationDto(phoneNumber, isVerified, refreshToken);

        expect(dto.phoneNumber).toBe(phoneNumber);
        expect(dto.isVerified).toBe(isVerified);
        expect(dto.refreshToken).toBe(refreshToken);
    });

    it('should allow different values for all properties', () => {
        const phoneNumber = '+905551112233';
        const isVerified = false;
        const refreshToken = 'another-token';

        const dto = new UpdateUserAuthenticationDto(phoneNumber, isVerified, refreshToken);

        expect(dto.phoneNumber).toBe('+905551112233');
        expect(dto.isVerified).toBe(false);
        expect(dto.refreshToken).toBe('another-token');
    });
});