const RabbitMQQueueManager = require('../../../managers/rabbitMqQueueManager');
const amqp = require('amqplib');
const CommonUtils = require('../../../utilities/commonUtils');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('amqplib', () => ({
    connect: jest.fn(),
}));

jest.mock('../../../utilities/commonUtils', () => ({
    waitForVariableToBecomeNonNull: jest.fn(),
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

describe('RabbitMQQueueManager Unit Test', () => {
    let manager;
    let mockConnection;
    let mockChannel;

    beforeEach(() => {
        jest.clearAllMocks();

        mockChannel = {
        close: jest.fn(),
        assertQueue: jest.fn(),
        sendToQueue: jest.fn().mockReturnValue(true),
        };

        mockConnection = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
        close: jest.fn(),
        };

        amqp.connect.mockResolvedValue(mockConnection);

        manager = new RabbitMQQueueManager('amqp://localhost');
    });

    it('should establish a connection and create a channel', async () => {
        await manager.establishConnection();
        expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
        expect(mockConnection.createChannel).toHaveBeenCalled();
        expect(manager.getRabbitMqChannel()).toBe(mockChannel);
        expect(manager.getRabbitMqConnection()).toBe(mockConnection);
    });

    it('should dispose the connection and channel', async () => {
        await manager.establishConnection();
        await manager.disposeConnection();
        expect(mockChannel.close).toHaveBeenCalled();
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should queue a message successfully', async () => {
        await manager.establishConnection();
        await manager.queueMessage('test-queue', 'application/json', 'utf-8', '{"data":"test"}');

        expect(CommonUtils.waitForVariableToBecomeNonNull).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith('test-queue', { durable: true });
        expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'test-queue',
        Buffer.from('{"data":"test"}', 'utf-8'),
        { persistent: true, contentType: 'application/json' }
        );
    });

    it('should log error and throw if establishing connection fails', async () => {
        amqp.connect.mockRejectedValue(new Error('Connection Failed'));
        await expect(manager.establishConnection()).rejects.toThrow('Connection Failed');
        expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalled();
    });

    it('should log error and throw if disposing connection fails', async () => {
        await manager.establishConnection();
        mockChannel.close.mockRejectedValue(new Error('Channel Close Failed'));
        await expect(manager.disposeConnection()).rejects.toThrow('Channel Close Failed');
        expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalled();
    });
});
