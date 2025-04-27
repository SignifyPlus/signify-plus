const UpdateProfileDto = require('../../../dtos/UpdateProfileDto');

describe('UpdateProfileDto Unit Test', () => {
    it('should correctly assign all properties', () => {
        const dto = new UpdateProfileDto(
            '1234567890',
            'dark',
            true,
            false,
            'English',
            '/images/profile.png',
        );

        expect(dto.phoneNumber).toBe('1234567890');
        expect(dto.theme).toBe('dark');
        expect(dto.autoDownload).toBe(true);
        expect(dto.notificationEnabled).toBe(false);
        expect(dto.aslTranslationLanguage).toBe('English');
        expect(dto.profilePicturePath).toBe('/images/profile.png');
    });

    it('should allow undefined values when not provided', () => {
        const dto = new UpdateProfileDto();
        expect(dto.phoneNumber).toBeUndefined();
        expect(dto.theme).toBeUndefined();
        expect(dto.autoDownload).toBeUndefined();
        expect(dto.notificationEnabled).toBeUndefined();
        expect(dto.aslTranslationLanguage).toBeUndefined();
        expect(dto.profilePicturePath).toBeUndefined();
    });
});
