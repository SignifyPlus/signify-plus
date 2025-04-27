const EventConstants = require('../../../constants/eventConstants.js');

describe('EventConstants Unit Test', () => {
    it('should have correct MESSAGE_INGEST_EVENT', () => {
        expect(EventConstants.MESSAGE_INGEST_EVENT).toBe('ingest-message');
    });

    it('should have correct ACCESSIBILITY_SETTINGS_EVENT', () => {
        expect(EventConstants.ACCESSIBILITY_SETTINGS_EVENT).toBe('accessibility-settings');
    });

    it('should have correct UPDATE_USER_EVENT', () => {
        expect(EventConstants.UPDATE_USER_EVENT).toBe('update-user-event');
    });

    it('should have correct CHAT_CREATED_EVENT', () => {
        expect(EventConstants.CHAT_CREATED_EVENT).toBe('chat-created');
    });
});
