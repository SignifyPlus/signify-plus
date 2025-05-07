const AwsS3PresignedResponse = require('../../../../../managers/Aws/models/AwsS3PresignedResponse');

describe('AwsS3PresignedResponse DTO', () => {
    it('should correctly assign presignedUrl and publicUrl via constructor', () => {
        const presignedUrl = 'https://signed-url.example.com';
        const publicUrl = 'https://bucket.s3.region.amazonaws.com/file.jpg';

        const dto = new AwsS3PresignedResponse(presignedUrl, publicUrl);

        expect(dto.presignedUrl).toBe(presignedUrl);
        expect(dto.publicUrl).toBe(publicUrl);
    });

    it('should allow different values for presignedUrl and publicUrl', () => {
        const presignedUrl = 'https://another-signed-url.com';
        const publicUrl = 'https://bucket.s3.region.amazonaws.com/another-file.png';

        const dto = new AwsS3PresignedResponse(presignedUrl, publicUrl);

        expect(dto).toMatchObject({
            presignedUrl: presignedUrl,
            publicUrl: publicUrl,
        });
    });
});