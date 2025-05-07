const AmazonS3Controller = require('../../../controllers/AmazonS3Controller');
const CommonConstants = require('../../../constants/commonConstants');
const CommonUtils = require('../../../utilities/commonUtils');
const ManagerFactory = require('../../../factories/managerFactory');
const ServiceFactory = require('../../../factories/serviceFactory');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: jest.fn((value, code, msg, res) => {
    if (!value) {
        res.status(code).json({ Message: msg });
        return true;
    }
    return false;
    }),
}));

jest.mock('../../../utilities/commonUtils', () => ({
    generateUuid: jest.fn().mockResolvedValue('uuid-test'),
}));

jest.mock('../../../factories/serviceFactory', () => ({
    getUserService: {
    getDocumentByCustomFilters: jest.fn().mockResolvedValue({
        _id: { toString: () => 'user123' },
    }),
    },
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
    info: jest.fn(),
    },
}));

describe('AmazonS3Controller Integrity Test', () => {
    let controller;
    let mockRequest;
    let mockResponse;

    beforeAll(() => {
        controller = new AmazonS3Controller();

        CommonConstants.EXTENSION_TO_MIME_TYPE_MAP = {
            '.jpg': 'image/jpeg',
        };

        const mockS3Manager = {
        generatePresignedS3ProfilePictureUploadUrl: jest.fn().mockResolvedValue({
            url: 'https://s3.amazonaws.com/fake-url',
            expiresIn: 300,
        }),
        };
        ManagerFactory.getAwsS3Manager = jest.fn(() => mockS3Manager);
    });

    beforeEach(() => {
        mockRequest = {
        body: {
            phoneNumber: '+1234567890',
            extension: '.jpg',
        },
        };

        mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
    });

    it('should return presigned S3 URL and call all steps', async () => {
        await controller.getPresignedS3ProfilePicturebucketUrl(mockRequest, mockResponse);

        expect(CommonUtils.generateUuid).toHaveBeenCalled();
        expect(ServiceFactory.getUserService.getDocumentByCustomFilters).toHaveBeenCalledWith({
            phoneNumber: '+1234567890',
        });
        expect(mockResponse.json).toHaveBeenCalledWith({
            url: 'https://s3.amazonaws.com/fake-url',
            expiresIn: 300,
        });
    }, 10000);

    it('should return 400 if phoneNumber is missing', async () => {
        mockRequest.body.phoneNumber = null;

        await controller.getPresignedS3ProfilePicturebucketUrl(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
            Message: expect.stringContaining('phoneNumber is missing'),
        }),
        );
    }, 10000);

    it('should return 400 if extension is invalid', async () => {
        mockRequest.body.extension = '.tiff';

        await controller.getPresignedS3ProfilePicturebucketUrl(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
            Message: expect.stringContaining('Not a valid extension type'),
        }),
        );
    }, 10000);
});