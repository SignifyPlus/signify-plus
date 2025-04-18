class UpdateProfileDto {
   constructor(
      userId,
      theme,
      autoDownload,
      notificationEnabled,
      aslTranslationLanguage,
      profilePicture,
   ) {
      this.userId = userId;
      this.theme = theme;
      this.autoDownload = autoDownload;
      this.notificationEnabled = notificationEnabled;
      this.aslTranslationLanguage = aslTranslationLanguage;
      this.profilePicture = profilePicture;
   }
}

module.exports = UpdateProfileDto;
