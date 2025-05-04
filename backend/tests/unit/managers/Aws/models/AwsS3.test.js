const AwsS3Dto = require('../../../../../managers/Aws/models/AwsS3');

describe('AwsS3Dto', () => {
    it('should correctly assign all constructor parameters', () => {
        const accessKey = 'AKIA_TEST_KEY';
        const secretAccessKey = 'SECRET_TEST_KEY';
        const region = 'us-west-1';
        const bucketName = 'my-bucket';
        const folderName = 'uploads';

        const dto = new AwsS3Dto(
            accessKey,
            secretAccessKey,
            region,
            bucketName,
            folderName
        );

        expect(dto.accessKey).toBe(accessKey);
        expect(dto.secretAccessKey).toBe(secretAccessKey);
        expect(dto.region).toBe(region);
        expect(dto.bucketName).toBe(bucketName);
        expect(dto.folderName).toBe(folderName);
    });

    it('should allow different values for each property', () => {
        const accessKey = 'AKIA_OTHER';
        const secretAccessKey = 'SECRET_OTHER';
        const region = 'eu-central-1';
        const bucketName = 'another-bucket';
        const folderName = 'images';

        const dto = new AwsS3Dto(accessKey, secretAccessKey, region, bucketName, folderName);

        expect(dto).toMatchObject({
            accessKey: accessKey,
            secretAccessKey: secretAccessKey,
            region: region,
            bucketName: bucketName,
            folderName: folderName,
        });
    });
});