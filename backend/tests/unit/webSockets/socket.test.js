const Socket = require('../../../webSockets/socket');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

describe('Socket Unit Test', () => {
    let socketMock;
    let userSocketMap;

    beforeEach(() => {
        socketMock = {
        id: 'mock-socket-id',
        on: jest.fn(),
        };
        userSocketMap = {};

        jest.clearAllMocks();
    });

    it('should register "socket-registration" and "socket-disconnect" events', () => {
        new Socket(socketMock, userSocketMap);

        expect(socketMock.on).toHaveBeenCalledWith('socket-registration', expect.any(Function));
        expect(socketMock.on).toHaveBeenCalledWith('socket-disconnect', expect.any(Function));
    });

    it('should add userPhoneNumber to userSocketMap and log registration on "socket-registration"', () => {
        new Socket(socketMock, userSocketMap);

        const registrationCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'socket-registration'
        )[1];

        const data = { userPhoneNumber: '111' };
        registrationCallback(data);

        expect(userSocketMap['111']).toBe('mock-socket-id');
        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
        `User 111 registered with socket ID: mock-socket-id`
        );
    });

    it('should log disconnection event on "socket-disconnect"', () => {
        new Socket(socketMock, userSocketMap);

        const disconnectCallback = socketMock.on.mock.calls.find(
        ([eventName]) => eventName === 'socket-disconnect'
        )[1];

        disconnectCallback();

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
        `Socket with id mo disconnected`
        );
    });
});