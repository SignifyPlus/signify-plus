const io = require('socket.io-client');

jest.mock('socket.io-client', () => {
    const mSocket = {
        on: jest.fn(),
        emit: jest.fn(),
    };
    return jest.fn(() => mSocket);
});

describe('WebSocketClientMessageMock Unit Test', () => {
    let mockSocketUser1;
    let mockSocketUser2;

    beforeEach(() => {
        jest.resetModules();
        mockSocketUser1 = require('socket.io-client')('http://localhost:3001');
        mockSocketUser2 = require('socket.io-client')('http://localhost:3001');
    });

    it('should connect and emit socket-registration and message events for User 1', () => {
        require('../../../mock/WebSocketClientMessageMock');

        expect(mockSocketUser1.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('message', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('message-failure', expect.any(Function));
    });

    it('should connect and emit socket-registration for User 2', () => {
        require('../../../mock/WebSocketClientMessageMock');

        expect(mockSocketUser2.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('message', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('message-failure', expect.any(Function));
    });
});
