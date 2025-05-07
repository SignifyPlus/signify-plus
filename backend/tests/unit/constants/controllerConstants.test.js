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


    it('should not allow modification of static constants', () => {
        const origMessageLimit = ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION;
        const origSaltRound     = ControllerConstants.SALT_ROUND_FOR_USERS_CONTROLLER;
        const origZeroIndex     = ControllerConstants.ZERO_INDEX;

        ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION = 999;
        ControllerConstants.SALT_ROUND_FOR_USERS_CONTROLLER = 999;
        ControllerConstants.ZERO_INDEX = 999;

        expect(ControllerConstants.MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION).toBe(origMessageLimit);
        expect(ControllerConstants.SALT_ROUND_FOR_USERS_CONTROLLER).toBe(origSaltRound);
        expect(ControllerConstants.ZERO_INDEX).toBe(origZeroIndex);
    });
});