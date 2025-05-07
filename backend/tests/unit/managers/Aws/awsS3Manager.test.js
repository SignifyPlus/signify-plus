const AwsS3Manager = require('../../../../managers/Aws/awsS3Manager');
const AwsS3 = require('../../../../managers/Aws/models/AwsS3');
const AwsS3PresignedResponse = require('../../../../managers/Aws/models/AwsS3PresignedResponse');
const S3Client = require('@aws-sdk/client-s3');
S3Client.PutObjectCommand = class {};
const S3RequestPresigner = require('@aws-sdk/s3-request-presigner');
const CommonConstants = require('../../../../constants/commonConstants');
const LoggerFactory = require('../../../../factories/loggerFactory');

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('../../../../factories/loggerFactory');

describe('AwsS3Manager', () => {
    const OLD_ENV = process.env;
    const dummyAccessKeyEnc = Buffer.from('AKIA_TEST').toString('base64');
    const dummySecretKeyEnc = Buffer.from('SECRET_TEST').toString('base64');

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...OLD_ENV,
            AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_ACCESS_KEY_ENCRYPTED: dummyAccessKeyEnc,
            AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_SECRET_ACCESS_KEY_ENCRYPTED: dummySecretKeyEnc,
            AWS_S3_BUCKET_REGION: 'us-west-2',
            AWS_S3_BUCKET_NAME: 'test-bucket',
            AWS_S3_BUCKET_PROFILE_PICTURES_FOLDER_NAME: 'profiles',
        };

        LoggerFactory.getApplicationLogger = { info: jest.fn(), error: jest.fn() };
    });

    afterEach(() => {
        process.env = OLD_ENV;
        jest.clearAllMocks();
    });

    it('should create AwsS3 DTO on construction', async () => {
        const manager = new AwsS3Manager();
        await Promise.resolve();
        const dto = manager.getAwsS3Dto;
        expect(dto).toBeInstanceOf(AwsS3);
        expect(dto.accessKey).toBe('AKIA_TEST');
        expect(dto.secretAccessKey).toBe('SECRET_TEST');
        expect(dto.region).toBe('us-west-2');
        expect(dto.bucketName).toBe('test-bucket');
        expect(dto.folderName).toBe('profiles');
    });

    it('should initialize S3 connection with correct credentials', async () => {
        const manager = new AwsS3Manager();
        await Promise.resolve();

        const fakeS3 = {};
        S3Client.S3.mockImplementation(() => fakeS3);
        await manager.initiateS3Connection();
        expect(S3Client.S3).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: 'AKIA_TEST',
                secretAccessKey: 'SECRET_TEST',
            },
            region: 'us-west-2',
        });
        expect(manager.getAwsS3Connection).toBe(fakeS3);
    });

    it('should generate presigned upload URL and public URL', async () => {
        const manager = new AwsS3Manager();
        await Promise.resolve();
        await manager.initiateS3Connection();
        S3RequestPresigner.getSignedUrl.mockResolvedValue('https://signed-url');
        const response = await manager.generatePresignedS3ProfilePictureUploadUrl('file.jpg', 'image/jpeg');
        expect(S3RequestPresigner.getSignedUrl).toHaveBeenCalledWith(
            manager.getAwsS3Connection,
            expect.any(S3Client.PutObjectCommand),
            { expiresIn: CommonConstants.S3_PRE_SIGNED_URL_EXPIRATION_TIME }
        );
        expect(response).toBeInstanceOf(AwsS3PresignedResponse);
        expect(S3RequestPresigner.getSignedUrl).toHaveBeenCalled();
        expect(response.publicUrl).toBe('https://test-bucket.s3.us-west-2.amazonaws.com/profiles/file.jpg');
    });

    it('should log error when environment variables missing', async () => {
        delete process.env.AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_ACCESS_KEY_ENCRYPTED;
        const manager = new AwsS3Manager();
        await Promise.resolve();
        expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalledWith(
            expect.stringContaining('One or more environment variables are not set')
        );
        expect(manager.getAwsS3Dto).toBeNull();
    });
});