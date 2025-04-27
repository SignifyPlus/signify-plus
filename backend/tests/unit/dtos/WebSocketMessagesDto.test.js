const WebSocketMessageDto = require('../../../dtos/WebSocketMessageDto');

describe('WebSocketMessageDto Unit Test', () => {
    it('should correctly assign all properties', () => {
        const dto = new WebSocketMessageDto(
        'chat123',
        '1234567890',
        ['0987654321', '1122334455'],
        'Hello World!',
        );

        expect(dto.chatId).toBe('chat123');
        expect(dto.senderPhoneNumber).toBe('1234567890');
        expect(dto.targetPhoneNumbers).toEqual(['0987654321', '1122334455']);
        expect(dto.message).toBe('Hello World!');
    });

    it('should allow undefined values when not provided', () => {
        const dto = new WebSocketMessageDto();

        expect(dto.chatId).toBeUndefined();
        expect(dto.senderPhoneNumber).toBeUndefined();
        expect(dto.targetPhoneNumbers).toBeUndefined();
        expect(dto.message).toBeUndefined();
    });
});
