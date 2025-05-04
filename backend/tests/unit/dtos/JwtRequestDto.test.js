const JwtRequestDto = require('../../../dtos/JwtRequestDto');

describe('JwtRequestDto', () => {
    it('should correctly assign phoneNumber and refreshToken', () => {
        const phone = '+1234567890';
        const token = 'refresh-token-xyz';

        const dto = new JwtRequestDto(phone, token);

        expect(dto.phoneNumber).toBe(phone);
        expect(dto.refreshToken).toBe(token);
    });

    it('should allow different phoneNumber and refreshToken values', () => {
        const phone = '+905551112233';
        const token = 'another-token';

        const dto = new JwtRequestDto(phone, token);

        expect(dto.phoneNumber).toBe('+905551112233');
        expect(dto.refreshToken).toBe('another-token');
    });
});