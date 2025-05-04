const AmazonS3Controller = require('../../../controllers/AmazonS3Controller');
const AmazonS3RequestDto = require('../../../dtos/AmazonS3RequestDto');
const CommonConstants = require('../../../constants/commonConstants');
const ServiceFactory = require('../../../factories/serviceFactory');
const ManagerFactory = require('../../../factories/managerFactory');
const CommonUtils = require('../../../utilities/commonUtils');

jest.mock('../../../factories/serviceFactory');
jest.mock('../../../factories/managerFactory');
jest.mock('../../../utilities/commonUtils');
jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

describe('AmazonS3Controller Unit Test', () => {
    let controller;
    let mockRequest;
    let mockResponse;


    beforeEach(() => {
        controller = new AmazonS3Controller();

        mockRequest = {
        body: {
            phoneNumber: '+1234567890',
            extension: '.png',
        },
        };

        mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };

        ServiceFactory.getUserService = {
        getDocumentByCustomFilters: jest.fn(),
        };

        ManagerFactory.getAwsS3Manager = jest.fn(() => ({
        generatePresignedS3ProfilePictureUploadUrl: jest.fn(),
        }));

        CommonUtils.generateUuid = jest.fn();
    });

    it('should return presigned URL when valid input is provided', async () => {
        const mockUser = { _id: { toString: () => 'user123' } };
        const mockPresignedUrl = { url: 'https://mock-s3.com/upload' };
        const mockUuid = 'uuid-xyz';

        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValueOnce(mockUser);
        CommonUtils.generateUuid.mockResolvedValueOnce(mockUuid);

        const generatePresignedMock = jest.fn().mockResolvedValueOnce(mockPresignedUrl);
        ManagerFactory.getAwsS3Manager.mockReturnValue({ generatePresignedS3ProfilePictureUploadUrl: generatePresignedMock });

        await controller.getPresignedS3ProfilePicturebucketUrl(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith(mockPresignedUrl);
    });
});
