const RabbitMqMessageProcessor = require('../../../processors/rabbitMqMessageProcessor');
const EventDispatcher = require('../../../events/eventDispatcher');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('../../../events/eventDispatcher', () => ({
    dispatchEvent: jest.fn(),
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

describe('RabbitMqMessageProcessor Unit Test', () => {
    let processor;
    let mockRabbitMqChannel;

    beforeEach(() => {
        processor = new RabbitMqMessageProcessor();
        mockRabbitMqChannel = {
        assertQueue: jest.fn(),
        consume: jest.fn((queue, callback) => {
            // Mock consumption behavior
            const mockMessage = {
            content: Buffer.from(JSON.stringify({ text: 'Test message' })),
            };
            callback(mockMessage);
            return 'mockConsumerTag';
        }),
        ack: jest.fn(),
        cancel: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('should assert queue, consume message, ack, log and dispatch event successfully', async () => {
        await processor.executeMessageProcessor(mockRabbitMqChannel, 'TEST_EVENT', 'test-queue');

        expect(mockRabbitMqChannel.assertQueue).toHaveBeenCalledWith('test-queue', { durable: true });
        expect(mockRabbitMqChannel.consume).toHaveBeenCalledWith(
        'test-queue',
        expect.any(Function),
        { noAck: false }
        );
        expect(mockRabbitMqChannel.ack).toHaveBeenCalled();
        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(expect.any(String));
        expect(EventDispatcher.dispatchEvent).toHaveBeenCalledWith('TEST_EVENT', { text: 'Test message' });
    });

    it('should halt consumer and throw error if exception occurs during executeMessageProcessor', async () => {
        mockRabbitMqChannel.assertQueue.mockRejectedValue(new Error('Queue assertion failed'));

        await expect(
        processor.executeMessageProcessor(mockRabbitMqChannel, 'TEST_EVENT', 'test-queue')
        ).rejects.toThrow('Tried to close a consumer tag which is null!');

        expect(LoggerFactory.getApplicationLogger.error).toHaveBeenCalled();
    });

    it('should throw error if haltConsumer is called with null consumerTag', async () => {
        await expect(processor.haltConsumer(mockRabbitMqChannel, null)).rejects.toThrow(
        'Tried to close a consumer tag which is null!'
        );
    });

    it('should cancel the consumer when haltConsumer is called', async () => {
        await processor.haltConsumer(mockRabbitMqChannel, 'mockConsumerTag');
        expect(mockRabbitMqChannel.cancel).toHaveBeenCalledWith('mockConsumerTag');
    });
});
