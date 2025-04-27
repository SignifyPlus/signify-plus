const io = require('socket.io-client');

jest.mock('socket.io-client', () => {
    const mSocket = {
        on: jest.fn(),
        emit: jest.fn(),
    };
    return jest.fn(() => mSocket);
});

describe('WebSocketClientVoiceCallMock Unit Test', () => {
    let mockSocketUser1, mockSocketUser2;

    beforeEach(() => {
        jest.resetModules();
        mockSocketUser1 = require('socket.io-client')('http://localhost:3001');
        mockSocketUser2 = require('socket.io-client')('http://localhost:3001');
    });

    it('should connect and register events for Mock User 1', () => {
        require('../../../mock/WebSocketClientVoiceCallMock');

        expect(mockSocketUser1.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('incoming-call', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('decline', expect.any(Function));
        expect(mockSocketUser1.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('should connect and register events for Mock User 2', () => {
        require('../../../mock/WebSocketClientVoiceCallMock');

        expect(mockSocketUser2.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('incoming-call', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('decline', expect.any(Function));
        expect(mockSocketUser2.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
});