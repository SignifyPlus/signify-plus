const WebSocketManager = require('../../../managers/websocketManager');
const socketIo = require('socket.io');

jest.mock('socket.io', () => jest.fn(() => ({
    on: jest.fn(),
})));

jest.mock('../../../webSockets/socket.js', () => jest.fn());
jest.mock('../../../webSockets/messageSocket.js', () => jest.fn());
jest.mock('../../../webSockets/meetingSocket.js', () => jest.fn());
jest.mock('../../../webSockets/voiceCallSocket.js', () => jest.fn());

describe('WebSocketManager Unit Test', () => {
    let mockServer;
    let mockSocketIo;

    beforeEach(() => {
        jest.clearAllMocks();
        mockServer = {};
        mockSocketIo = {
            on: jest.fn(),
        };
        socketIo.mockReturnValue(mockSocketIo);
    });

    it('should initialize socket.io with the server and setup connection event', () => {
        const manager = new WebSocketManager(mockServer);

        expect(socketIo).toHaveBeenCalledWith(mockServer, { cors: { origin: '*' } });
        expect(manager.signifyPlusSocketIo).toBe(mockSocketIo);
        expect(manager.userSocketMap).toEqual({});
        expect(mockSocketIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
});
