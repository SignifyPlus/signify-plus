class UpdateProfileDto {
   constructor(
      phoneNumber,
      theme,
      autoDownload,
      notificationEnabled,
      aslTranslationLanguage,
      profilePicturePath,
   ) {
      this.phoneNumber = phoneNumber;
      this.theme = theme;
      this.autoDownload = autoDownload;
      this.notificationEnabled = notificationEnabled;
      this.aslTranslationLanguage = aslTranslationLanguage;
      this.profilePicturePath = profilePicturePath;
   }
}

module.exports = UpdateProfileDto;
