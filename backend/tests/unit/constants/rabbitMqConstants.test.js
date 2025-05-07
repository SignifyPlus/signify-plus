const RabbitMqConstants = require('../../../constants/rabbitMqConstants.js');

describe('RabbitMqConstants Unit Test', () => {
    it('should have correct MESSAGES_QUEUE', () => {
        expect(RabbitMqConstants.MESSAGES_QUEUE).toBe('messages');
    });

    it('should have correct APPLICATION_JSON_CONTENT_TYPE', () => {
        expect(RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE).toBe('application/json');
    });

    it('should not allow modification of static constants', () => {
        const origQueue = RabbitMqConstants.MESSAGES_QUEUE;
        const origContentType = RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE;

        RabbitMqConstants.MESSAGES_QUEUE = 'modified';
        RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE = 'modified';

        expect(RabbitMqConstants.MESSAGES_QUEUE).toBe(origQueue);
        expect(RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE).toBe(origContentType);
    });
});