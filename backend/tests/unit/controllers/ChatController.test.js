jest.mock('mongoose', () => ({
    Types: {
        ObjectId: jest.fn((id) => id),
    },
}));

const ChatController = require('../../../controllers/ChatController');
const ServiceFactory = require('../../../factories/serviceFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../factories/serviceFactory', () => ({
    getUserService: {
        getDocumentByCustomFilters: jest.fn(),
        getDocumentsByCustomFilters: jest.fn(),
    },
    getChatService: {
        getDocumentsByCustomFiltersQuery: jest.fn(),
        getDocumentsQuery: jest.fn(),
        saveDocument: jest.fn(),
        getDocumentsByCustomFilters: jest.fn(),
    },
    getMessageService: {
        getDocumentsByCustomFiltersQuery: jest.fn(),
        getDocumentsByCustomFiltersAndSortByCreatedAt: jest.fn(),
    },
    getMongooseService: {
        getMongooseSession: jest.fn(),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    },
}));

jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: jest.fn(),
}));

describe('ChatController Unit Test', () => {
    let chatController;
    let reqMock;
    let resMock;

    beforeEach(() => {
    chatController = new ChatController();

    reqMock = {
        body: {},
        params: {},
    };

    resMock = {
        status: jest.fn(() => resMock),
        json: jest.fn(),
    };

    jest.clearAllMocks();
    });

    describe('initializeEmptyChat', () => {
    it('should create a new chat successfully', async () => {
        chatController.createAndPostProcessChats = jest.fn().mockResolvedValue({ data: 'chatCreated' });

        reqMock.body = {
        mainUserPhoneNumber: '+111111111',
        participants: ['+222222222'],
        };

        await chatController.initializeEmptyChat(reqMock, resMock);

        expect(chatController.createAndPostProcessChats).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith('chatCreated');
    });

    it('should return error if result has exception', async () => {
        const mockException = { exception: { status: 400, loadResult: jest.fn(() => ({ error: 'some error' })) }};
        chatController.createAndPostProcessChats = jest.fn().mockResolvedValue(mockException);

        await chatController.initializeEmptyChat(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith({ error: 'some error' });
    });
    });

    describe('getChatByPhoneNumber', () => {
    it('should get user chats successfully', async () => {
        ExceptionHelper.validate.mockResolvedValue(null);
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'user-id' });

        const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: 'chat-id', participants: [], mainUserId: { _id: 'user-id' } }]),
        };
        ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);

        await chatController.getChatByPhoneNumber(reqMock, resMock);

        expect(ServiceFactory.getUserService.getDocumentByCustomFilters).toHaveBeenCalled();
        expect(ServiceFactory.getChatService.getDocumentsByCustomFiltersQuery).toHaveBeenCalled();
    });
    });

    describe('getChatHistoryById', () => {
    it('should get chat history by chat ID', async () => {
        ExceptionHelper.validate.mockResolvedValue(null);

        const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ content: 'message1' }, { content: 'message2' }]),
        };
        ServiceFactory.getMessageService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);

        reqMock.params.chatId = 'chatId123';

        await chatController.getChatHistoryById(reqMock, resMock);

        expect(ServiceFactory.getMessageService.getDocumentsByCustomFiltersQuery).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith({
        messages: [{ content: 'message1' }, { content: 'message2' }],
        totalNumberOfMessages: 2,
        });
    });
    });

    describe('getAllChats', () => {
    it('should return all chats successfully', async () => {
        const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: 'chat1' }, { _id: 'chat2' }]),
        };
        ServiceFactory.getChatService.getDocumentsQuery.mockReturnValue(mockQuery);

        const result = await chatController.getAllChats();

        expect(ServiceFactory.getChatService.getDocumentsQuery).toHaveBeenCalled();
        expect(result).toEqual([{ _id: 'chat1' }, { _id: 'chat2' }]);
    });

    it('should return SignifyException if error occurs', async () => {
        ServiceFactory.getChatService.getDocumentsQuery.mockImplementation(() => {
        throw new Error('Query failed');
        });

        const result = await chatController.getAllChats();
        expect(result).toBeInstanceOf(SignifyException);
    });
    });
});