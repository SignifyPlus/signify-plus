const CallDto = require('../../../dtos/CallDto');

describe('CallDto', () => {
    it('should correctly assign all properties', () => {
        const sender = '+1234567890';
        const targets = ['+1111111111', '+2222222222'];
        const meetingId = 'meeting-abc';
        const isVoiceCall = true;

        const dto = new CallDto(sender, targets, meetingId, isVoiceCall);

        expect(dto.senderPhoneNumber).toBe(sender);
        expect(dto.targetPhoneNumbers).toEqual(targets);
        expect(dto.meetingId).toBe(meetingId);
        expect(dto.isVoiceCall).toBe(isVoiceCall);
    });

    it('should handle false isVoiceCall flag and empty targets', () => {
        const sender = '+0987654321';
        const targets = [];
        const meetingId = 'meeting-xyz';
        const isVoiceCall = false;

        const dto = new CallDto(sender, targets, meetingId, isVoiceCall);

        expect(dto.senderPhoneNumber).toBe(sender);
        expect(dto.targetPhoneNumbers).toEqual([]);
        expect(dto.meetingId).toBe(meetingId);
        expect(dto.isVoiceCall).toBe(false);
    });
});