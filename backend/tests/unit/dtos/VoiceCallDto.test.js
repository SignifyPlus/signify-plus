const VoiceCallDto = require('../../../dtos/VoiceCallDto');

describe('VoiceCallDto Unit Test', () => {
    it('should correctly assign senderPhoneNumber and targetPhoneNumbers', () => {
        const dto = new VoiceCallDto('1234567890', ['0987654321', '1122334455']);
        
        expect(dto.senderPhoneNumber).toBe('1234567890');
        expect(dto.targetPhoneNumbers).toEqual(['0987654321', '1122334455']);
    });

    it('should allow undefined values when not provided', () => {
        const dto = new VoiceCallDto();
        
        expect(dto.senderPhoneNumber).toBeUndefined();
        expect(dto.targetPhoneNumbers).toBeUndefined();
    });
});