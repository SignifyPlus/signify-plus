class UpdateSettingsDto {
   constructor(
      userId,
      theme,
      autoDownload,
      notificationEnabled,
      aslTranslationLanguage,
   ) {
      this.userId = userId;
      this.theme = theme;
      this.autoDownload = autoDownload;
      this.notificationEnabled = notificationEnabled;
      this.aslTranslationLanguage = aslTranslationLanguage;
   }
}

module.exports = UpdateSettingsDto;
