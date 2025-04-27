const VoiceCallSocket = require('../../../webSockets/voiceCallSocket');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

describe('VoiceCallSocket Unit Test', () => {
    let socketMock;
    let userSocketMap;

    beforeEach(() => {
        const toSocket = {
        emit: jest.fn(),
        };

        socketMock = {
        id: 'mock-socket-id',
        on: jest.fn(),
        emit: jest.fn(),
        to: jest.fn(() => toSocket),
        toSocket,
        };

        userSocketMap = {
        '222': 'socket-222',
        };

        jest.clearAllMocks();
    });

    it('should register "voice-call" event on socket', () => {
        new VoiceCallSocket(socketMock, userSocketMap);

        expect(socketMock.on).toHaveBeenCalledWith('voice-call', expect.any(Function));
    });

    it('should emit "incoming-call" to target socket if registered', async () => {
        new VoiceCallSocket(socketMock, userSocketMap);

        const voiceCallCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'voice-call'
        )[1];

        const data = {
        senderPhoneNumber: '111',
        targetPhoneNumbers: ['222'],
        };

        await voiceCallCallback(data);

        expect(socketMock.to).toHaveBeenCalledWith('socket-222');
        expect(socketMock.toSocket.emit).toHaveBeenCalledWith('incoming-call', {
        senderPhoneNumber: '111',
        incomingCall: true,
        });
    });

    it('should log and skip sending if target socket not registered', async () => {
        new VoiceCallSocket(socketMock, {});

        const voiceCallCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'voice-call'
        )[1];

        const data = {
        senderPhoneNumber: '111',
        targetPhoneNumbers: ['333'],
        };

        await voiceCallCallback(data);

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(expect.stringContaining('targetPhoneNumber is not registered'));
        expect(socketMock.emit).not.toHaveBeenCalledWith('incoming-call', expect.anything());
    });

    it('should handle exceptions and emit "voice-call-failure"', async () => {
        socketMock.to = jest.fn(() => { throw new Error('Mocked exception'); });

        new VoiceCallSocket(socketMock, userSocketMap);

        const voiceCallCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'voice-call'
        )[1];

        const data = {
        senderPhoneNumber: '111',
        targetPhoneNumbers: ['222'],
        };

        await voiceCallCallback(data);

        expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalledWith(expect.stringContaining('Exception Occured'));
        expect(socketMock.emit).toHaveBeenCalledWith('voice-call-failure', {
        error: expect.any(String),
        });
    });
});