const MessageSocket = require('../../../webSockets/messageSocket');
const LoggerFactory = require('../../../factories/loggerFactory');
const MessageSocketUtils = require('../../../webSockets/utils/messageSocketUtils');
const EventDispatcher = require('../../../events/eventDispatcher');
const WebSocketMessageDto = require('../../../dtos/WebSocketMessageDto');

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../../../webSockets/utils/messageSocketUtils', () => ({
    cacheChats: jest.fn(() => Promise.resolve([])),
    filterChat: jest.fn(),
    createNewChat: jest.fn(),
    prepareChatQueueData: jest.fn(),
}));

jest.mock('../../../events/eventDispatcher', () => ({
    registerListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

jest.mock('../../../dtos/WebSocketMessageDto', () => {
    return jest.fn().mockImplementation((chatId, senderPhoneNumber, targetPhoneNumbers, message) => ({
        chatId,
        senderPhoneNumber,
        targetPhoneNumbers,
        message,
    }));
});

describe('MessageSocket Unit Test', () => {
    let socketMock;
    let userSocketMap;

    beforeEach(() => {
        socketMock = {
        on: jest.fn(),
        emit: jest.fn(),
        to: jest.fn(() => ({
            emit: jest.fn(),
        })),
        };

        userSocketMap = {
        '111': 'socket-111',
        '222': 'socket-222',
        };

        jest.clearAllMocks();
    });

    it('should register "message" event on socket', async () => {
        new MessageSocket(socketMock, userSocketMap);

        expect(socketMock.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should emit "message-failure" if no targetPhoneNumbers provided', async () => {
        new MessageSocket(socketMock, userSocketMap);

        const messageCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'message'
        )[1];

        await messageCallback({
        chatId: null,
        senderPhoneNumber: '111',
        targetPhoneNumbers: [],
        message: 'Test Message',
        });

        expect(socketMock.emit).toHaveBeenCalledWith('message-failure', expect.objectContaining({
        error: expect.any(String),
        }));
    });

    it('should handle message and dispatch event when target socket exists', async () => {
        MessageSocketUtils.filterChat.mockResolvedValue('chat123');

        new MessageSocket(socketMock, userSocketMap);

        const messageCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'message'
        )[1];

        await messageCallback({
        chatId: null,
        senderPhoneNumber: '111',
        targetPhoneNumbers: ['222'],
        message: 'Hello',
        });

        expect(socketMock.to).toHaveBeenCalledWith('socket-222');
        expect(EventDispatcher.dispatchEvent).toHaveBeenCalled();
        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalled();
    });

    it('should log and skip sending message if target socket does not exist', async () => {
        new MessageSocket(socketMock, {});

        const messageCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'message'
        )[1];

        await messageCallback({
        chatId: null,
        senderPhoneNumber: '111',
        targetPhoneNumbers: ['333'],
        message: 'Hello',
        });

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(expect.stringContaining('targetPhoneNumber is not registered'));
    });
});