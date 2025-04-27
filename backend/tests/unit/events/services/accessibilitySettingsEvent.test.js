const AccessibilitySettingsEvent = require('../../../../events/services/accessibilitySettingsEvent');
const EventDispatcher = require('../../../../events/eventDispatcher');
const LoggerFactory = require('../../../../factories/loggerFactory');
const ControllerFactory = require('../../../../factories/controllerFactory');
const EventConstants = require('../../../../constants/eventConstants');

jest.mock('../../../../events/eventDispatcher', () => ({
    registerListener: jest.fn(),
}));

jest.mock('../../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

const mockCreateSettings = jest.fn();
jest.mock('../../../../factories/controllerFactory', () => ({
    getSettingsController: () => ({
        createSettings: mockCreateSettings,
    }),
}));

describe('AccessibilitySettingsEvent Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register listener on instantiation', () => {
        new AccessibilitySettingsEvent();
        expect(EventDispatcher.registerListener).toHaveBeenCalledWith(
            EventConstants.ACCESSIBILITY_SETTINGS_EVENT,
            expect.any(Function)
        );
    });

    it('should call logger and controller createSettings on createAccessibilitySettings', async () => {
        const event = new AccessibilitySettingsEvent();
        mockCreateSettings.mockResolvedValue('settings-created');

        const result = await event.createAccessibilitySettings('user123');

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('Creating default accessibility settings for the user user123')
        );
        expect(mockCreateSettings).toHaveBeenCalledWith('user123');
        expect(result).toBe('settings-created');
    });
});