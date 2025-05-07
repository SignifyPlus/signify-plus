const RabbitMqProcessorManager = require('../../../managers/rabbitMqProcessorManager');
const RabbitMqMessageProcessor = require('../../../processors/rabbitMqMessageProcessor');
const EventConstants = require('../../../constants/eventConstants');
const RabbitMqConstants = require('../../../constants/rabbitMqConstants');

jest.mock('../../../processors/rabbitMqMessageProcessor', () => {
    return jest.fn().mockImplementation(() => ({
        executeMessageProcessor: jest.fn(),
    }));
});

jest.mock('../../../constants/eventConstants', () => ({
    MESSAGE_INGEST_EVENT: 'mock_message_ingest_event',
}));

jest.mock('../../../constants/rabbitMqConstants', () => ({
    MESSAGES_QUEUE: 'mock_messages_queue',
}));

    describe('RabbitMqProcessorManager Unit Test', () => {
    let manager;
    let mockRabbitMqChannel;

    beforeEach(() => {
        jest.clearAllMocks();
        manager = new RabbitMqProcessorManager();
        mockRabbitMqChannel = {}; //simple mock channel
    });

    it('should instantiate RabbitMqMessageProcessor', () => {
        expect(RabbitMqMessageProcessor).toHaveBeenCalledTimes(1);
    });

    it('should call executeMessageProcessor with correct parameters', async () => {
        await manager.executeMessageProcessor(mockRabbitMqChannel);

        expect(manager.rabbitMqMessageProcessor.executeMessageProcessor).toHaveBeenCalledWith(
        mockRabbitMqChannel,
        EventConstants.MESSAGE_INGEST_EVENT,
        RabbitMqConstants.MESSAGES_QUEUE,
        );
    });
});