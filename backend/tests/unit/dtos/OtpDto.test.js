const OtpDto = require('../../../dtos/OtpDto');

describe('OtpDto', () => {
    it('should correctly assign phoneNumber and otpCode', () => {
        const phone = '+1234567890';
        const code = '654321';

        const dto = new OtpDto(phone, code);

        expect(dto.phoneNumber).toBe(phone);
        expect(dto.otpCode).toBe(code);
    });

    it('should allow different values for phoneNumber and otpCode', () => {
        const phone = '+905551112233';
        const code = '123456';

        const dto = new OtpDto(phone, code);

        expect(dto.phoneNumber).toBe('+905551112233');
        expect(dto.otpCode).toBe('123456');
    });
});