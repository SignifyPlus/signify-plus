const ControllerConstants = require('../../../constants/controllerConstants.js');

describe('ControllerConstants Unit Test', () => {
    it('should have correct MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION', () => {
        expect(ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION).toBe(300);
    });

    it('should have correct SALT_ROUND_FOR_USERS_CONTROLLER', () => {
        expect(ControllerConstants.SALT_ROUND_FOR_USERS_CONTROLLER).toBe(10);
    });

    it('should have correct ZERO_INDEX', () => {
        expect(ControllerConstants.ZERO_INDEX).toBe(0);
    });

    it('should have correct ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT', () => {
        expect(ControllerConstants.ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT).toEqual({
        English: 0,
        Turkish: 1,
        });
    });

    it('should have correct ASL_TRANSLATION_LANGUAGE_KEY', () => {
        expect(ControllerConstants.ASL_TRANSLATION_LANGUAGE_KEY).toBe('aslTranslationLanguage');
    });
});