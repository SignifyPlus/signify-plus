const EventConstants = require('../../../constants/eventConstants.js');

describe('EventConstants Unit Test', () => {
    it('should have correct MESSAGE_INGEST_EVENT', () => {
        expect(EventConstants.MESSAGE_INGEST_EVENT).toBe('ingest-message');
    });

    it('should have correct ACCESSIBILITY_SETTINGS_EVENT', () => {
        expect(EventConstants.ACCESSIBILITY_SETTINGS_EVENT).toBe('accessibility-settings');
    });

    it('should have correct USER_AUTHENTICAITON_EVENT', () => {
        expect(EventConstants.USER_AUTHENTICAITON_EVENT).toBe('user-authentication');
    });

    it('should have correct USER_AUTHENTICATION_UPDATE_EVENT', () => {
        expect(EventConstants.USER_AUTHENTICATION_UPDATE_EVENT).toBe('user-authentication-update');
    });

    it('should have correct UPDATE_USER_EVENT', () => {
        expect(EventConstants.UPDATE_USER_EVENT).toBe('update-user');
    });

    it('should have correct CHAT_CREATED_EVENT', () => {
        expect(EventConstants.CHAT_CREATED_EVENT).toBe('chat-created');
    });

    it('should not allow modification of any constants', () => {
        const originals = {
            MESSAGE_INGEST_EVENT: EventConstants.MESSAGE_INGEST_EVENT,
            ACCESSIBILITY_SETTINGS_EVENT: EventConstants.ACCESSIBILITY_SETTINGS_EVENT,
            USER_AUTHENTICAITON_EVENT: EventConstants.USER_AUTHENTICAITON_EVENT,
            USER_AUTHENTICATION_UPDATE_EVENT: EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
            UPDATE_USER_EVENT: EventConstants.UPDATE_USER_EVENT,
            CHAT_CREATED_EVENT: EventConstants.CHAT_CREATED_EVENT,
        };

        EventConstants.MESSAGE_INGEST_EVENT = 'modified';
        EventConstants.ACCESSIBILITY_SETTINGS_EVENT = 'modified';
        EventConstants.USER_AUTHENTICAITON_EVENT = 'modified';
        EventConstants.USER_AUTHENTICATION_UPDATE_EVENT = 'modified';
        EventConstants.UPDATE_USER_EVENT = 'modified';
        EventConstants.CHAT_CREATED_EVENT = 'modified';

        Object.entries(originals).forEach(([key, value]) => {
            expect(EventConstants[key]).toBe(value);
        });
    });
});
