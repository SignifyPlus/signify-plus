const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost
    })
}));

const mockValidate = jest.fn();
jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: mockValidate
}));

const mockGetChatController = jest.fn().mockReturnValue({
    getChatByPhoneNumber: 'mockGetChatByPhoneNumber',
    getChatHistoryById: 'mockGetChatHistoryById',
    initializeEmptyChat: 'mockInitializeEmptyChat'
});

jest.mock('../../../factories/controllerFactory', () => ({
    getChatController: mockGetChatController
}));

describe('ChatRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockValidate.mockClear();
        mockGetChatController.mockClear();
        jest.resetModules();
    });

    it('should define GET / and call ExceptionHelper.validate', () => {
        require('../../../routes/ChatRoutes');

        expect(mockGet).toHaveBeenCalledWith(
        '/',
        expect.any(Function)
        );

        // simulate the handler function and test validate call
        const handler = mockGet.mock.calls.find(call => call[0] === '/')[1];
        const req = {};
        const res = {};
        handler(req, res); // call async handler manually

        expect(mockValidate).toHaveBeenCalledWith(null, 400, 'phoneNumber is not provided.', res);
    });

    it('should register GET /:phoneNumber route with getChatByPhoneNumber handler', () => {
        require('../../../routes/ChatRoutes');

        expect(mockGet).toHaveBeenCalledWith('/:phoneNumber', 'mockGetChatByPhoneNumber');
    });

    it('should register GET /custom/id/:chatId route with getChatHistoryById handler', () => {
        require('../../../routes/ChatRoutes');

        expect(mockGet).toHaveBeenCalledWith('/custom/id/:chatId', 'mockGetChatHistoryById');
    });

    it('should register POST /create route with initializeEmptyChat handler', () => {
        require('../../../routes/ChatRoutes');

        expect(mockPost).toHaveBeenCalledWith('/create', 'mockInitializeEmptyChat');
    });
});