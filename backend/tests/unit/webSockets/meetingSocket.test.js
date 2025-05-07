const MeetingSocket = require('../../../webSockets/meetingSocket');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

describe('MeetingSocket Unit Test', () => {
    let socketMock;
    let userSocketMap;

    beforeEach(() => {
        const toSocket = {
            emit: jest.fn(),
        };

        socketMock = {
        id: 'mock-socket-id',
        on: jest.fn(),
        to: jest.fn(() => toSocket),
        emit: jest.fn(),
        toSocket,
        };

        userSocketMap = {
        '111': 'socket-111',
        '222': 'socket-222',
        };

        jest.clearAllMocks();
    });

    it('should register "meeting-id" and "meeting-id-decline" events on socket', () => {
        new MeetingSocket(socketMock, userSocketMap);

        expect(socketMock.on).toHaveBeenCalledWith('meeting-id', expect.any(Function));
        expect(socketMock.on).toHaveBeenCalledWith('meeting-id-decline', expect.any(Function));
    });

    it('should emit "meeting-id-offer" if target socket exists', () => {
        new MeetingSocket(socketMock, userSocketMap);

        const meetingIdCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'meeting-id'
        )[1];

        const data = {
        userPhoneNumber: '111',
        meetingId: 'meeting123',
        targetPhoneNumbers: ['222'],
        };

        meetingIdCallback(data);

        expect(socketMock.to).toHaveBeenCalledWith('socket-222');
        expect(socketMock.toSocket.emit).toHaveBeenCalledWith('meeting-id-offer', expect.objectContaining({
        senderSocketId: 'mock-socket-id',
        senderPhoneNumber: '111',
        meetingId: 'meeting123',
        }));
    });

    it('should emit "meeting-id-failed" if target socket does not exist', () => {
        new MeetingSocket(socketMock, userSocketMap);

        const meetingIdCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'meeting-id'
        )[1];

        const data = {
        userPhoneNumber: '111',
        meetingId: 'meeting123',
        targetPhoneNumbers: ['333'],
        };

        meetingIdCallback(data);

        expect(socketMock.emit).toHaveBeenCalledWith('meeting-id-failed', expect.objectContaining({
        senderSocketId: 'mock-socket-id',
        senderPhoneNumber: '111',
        message: expect.any(String),
        }));
    });

    it('should emit "call-declined" if target socket exists on decline', () => {
        new MeetingSocket(socketMock, userSocketMap);

        const declineCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'meeting-id-decline'
        )[1];

        const data = {
        userPhoneNumber: '111',
        meetingId: 'meeting123',
        targetPhoneNumber: '222',
        };

        declineCallback(data);

        expect(socketMock.to).toHaveBeenCalledWith('socket-222');
        expect(socketMock.toSocket.emit).toHaveBeenCalledWith('call-declined', expect.objectContaining({
        declinedUsersPhoneNumber: '111',
        message: 'Call Declined!',
        }));
    });

    it('should emit "meeting-id-decline-failed" if target socket does not exist on decline', () => {
        new MeetingSocket(socketMock, userSocketMap);

        const declineCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'meeting-id-decline'
        )[1];

        const data = {
        userPhoneNumber: '111',
        meetingId: 'meeting123',
        targetPhoneNumber: '333',
        };

        declineCallback(data);

        expect(socketMock.emit).toHaveBeenCalledWith('meeting-id-decline-failed', expect.objectContaining({
        senderPhoneNumber: '111',
        message: expect.stringContaining('Failed!'),
        }));
    });
});