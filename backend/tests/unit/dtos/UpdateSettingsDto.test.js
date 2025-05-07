const UpdateSettingsDto = require('../../../dtos/UpdateSettingsDto');

describe('UpdateSettingsDto', () => {
    it('should correctly assign all properties', () => {
        const userId = 'user123';
        const theme = 'dark';
        const autoDownload = true;
        const notificationEnabled = false;
        const aslTranslationLanguage = 'EN';

        const dto = new UpdateSettingsDto(
            userId,
            theme,
            autoDownload,
            notificationEnabled,
            aslTranslationLanguage
        );

        expect(dto.userId).toBe(userId);
        expect(dto.theme).toBe(theme);
        expect(dto.autoDownload).toBe(autoDownload);
        expect(dto.notificationEnabled).toBe(notificationEnabled);
        expect(dto.aslTranslationLanguage).toBe(aslTranslationLanguage);
    });

    it('should allow different values for all properties', () => {
        const userId = 'user456';
        const theme = 'light';
        const autoDownload = false;
        const notificationEnabled = true;
        const aslTranslationLanguage = 'TR';

        const dto = new UpdateSettingsDto(
            userId,
            theme,
            autoDownload,
            notificationEnabled,
            aslTranslationLanguage
        );

        expect(dto.userId).toBe('user456');
        expect(dto.theme).toBe('light');
        expect(dto.autoDownload).toBe(false);
        expect(dto.notificationEnabled).toBe(true);
        expect(dto.aslTranslationLanguage).toBe('TR');
    });
});