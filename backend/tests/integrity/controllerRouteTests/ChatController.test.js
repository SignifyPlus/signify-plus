const ChatController = require('../../../controllers/ChatController');
const ServiceFactory = require('../../../factories/serviceFactory');
const SignifyResult = require('../../../dtos/SignifyResult');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../factories/serviceFactory');

describe('ChatController Integrity Test', () => {
    let controller;
    let mockRequest, mockResponse;

    beforeEach(() => {
        controller = new ChatController();

        mockRequest = {
        body: {
            mainUserPhoneNumber: '+1234567890',
            participants: ['+1234560001', '+1234560002'],
        },
        params: {},
        query: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        ServiceFactory.getUserService.getDocumentByCustomFilters = jest.fn();
        ServiceFactory.getUserService.getDocumentsByCustomFilters = jest.fn();
        ServiceFactory.getChatService.getDocumentsByCustomFilters = jest.fn();
        ServiceFactory.getChatService.saveDocument = jest.fn();
        ServiceFactory.getMongooseService.getMongooseSession = jest.fn().mockResolvedValue({});
        ServiceFactory.getMongooseService.startMongooseTransaction = jest.fn();
        ServiceFactory.getMongooseService.commitMongooseTransaction = jest.fn();
        ServiceFactory.getMongooseService.abandonMongooseTransaction = jest.fn();
    });

    it('should return chat already exists if duplicate chat found', async () => {
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'mainUserId' });
        ServiceFactory.getUserService.getDocumentsByCustomFilters.mockResolvedValue([
            { _id: 'user1', phoneNumber: '+1234560001' },
            { _id: 'user2', phoneNumber: '+1234560002' },
        ]);
        ServiceFactory.getChatService.getDocumentsByCustomFilters.mockResolvedValue([
            { _id: 'existingChatId' },
        ]);

        const result = await controller.createAndPostProcessChats(
        mockRequest.body.mainUserPhoneNumber,
        mockRequest.body.participants
        );

        expect(result).toBeInstanceOf(SignifyResult);
        expect(result.data).toEqual([{ _id: 'existingChatId' }]);
        expect(result.exception).toBeInstanceOf(SignifyException);
        expect(result.exception.message).toMatch(/already exists/i);
    });

    it('should create and return a new chat if none exists', async () => {
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValueOnce({ _id: 'mainUserId' });
        ServiceFactory.getUserService.getDocumentsByCustomFilters.mockResolvedValue([
        { _id: 'user1', phoneNumber: '+1234560001' },
        { _id: 'user2', phoneNumber: '+1234560002' },
        ]);
        ServiceFactory.getChatService.getDocumentsByCustomFilters.mockResolvedValue([]);
        ServiceFactory.getChatService.saveDocument.mockResolvedValue([{ _id: 'newChatId' }]);

        const result = await controller.createAndPostProcessChats(
        mockRequest.body.mainUserPhoneNumber,
        mockRequest.body.participants
        );

        expect(result).toBeInstanceOf(SignifyResult);
        expect(result.data).toEqual([{ _id: 'newChatId' }]);
        expect(result.exception).toBeNull();
    });
});