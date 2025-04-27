const RabbitMqConstants = require('../../../constants/rabbitMqConstants.js');

describe('RabbitMqConstants Unit Test', () => {
    it('should have correct MESSAGES_QUEUE', () => {
        expect(RabbitMqConstants.MESSAGES_QUEUE).toBe('messages');
    });

    it('should have correct APPLICATION_JSON_CONTENT_TYPE', () => {
        expect(RabbitMqConstants.APPLICATION_JSON_CONTENT_TYPE).toBe('application/json');
    });
});