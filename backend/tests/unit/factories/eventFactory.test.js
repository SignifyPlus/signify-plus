const EventFactory = require('../../../factories/eventFactory');

describe('EventFactory Unit Test', () => {
    beforeEach(() => {
        EventFactory.setMessageEvent = null;
        EventFactory.setAccessibilitySettingsEvent = null;
        EventFactory.setUserEvent = null;
    });

    it('should set and get MessageEvent correctly', () => {
        const mockMessageEvent = { type: 'MockMessageEvent' };
        EventFactory.setMessageEvent = mockMessageEvent;
        expect(EventFactory.getMessageEvent).toBe(mockMessageEvent);
    });

    it('should set and get AccessibilitySettingsEvent correctly', () => {
        const mockAccessibilitySettingsEvent = { type: 'MockAccessibilitySettingsEvent' };
        EventFactory.setAccessibilitySettingsEvent = mockAccessibilitySettingsEvent;
        expect(EventFactory.getAccessibilitySettingsEvent).toBe(mockAccessibilitySettingsEvent);
    });

    it('should set and get UserEvent correctly', () => {
        const mockUserEvent = { type: 'MockUserEvent' };
        EventFactory.setUserEvent = mockUserEvent;
        expect(EventFactory.getUserEvent).toBe(mockUserEvent);
    });
});