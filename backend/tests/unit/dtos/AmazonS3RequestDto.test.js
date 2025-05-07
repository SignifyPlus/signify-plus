const AmazonS3RequestDto = require('../../../dtos/AmazonS3RequestDto');

describe('AmazonS3RequestDto', () => {
    it('should correctly assign phoneNumber and extension', () => {
        const phone = '+1234567890';
        const ext = '.jpg';

        const dto = new AmazonS3RequestDto(phone, ext);

        expect(dto.phoneNumber).toBe(phone);
        expect(dto.extension).toBe(ext);
    });

    it('should allow different values for phoneNumber and extension', () => {
        const phone = '+905551112233';
        const ext = '.png';

        const dto = new AmazonS3RequestDto(phone, ext);

        expect(dto.phoneNumber).toBe('+905551112233');
        expect(dto.extension).toBe('.png');
    });
});