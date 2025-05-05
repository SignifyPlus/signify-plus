class ControllerConstants {
   static MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION_IN_SECONDS = 60;
   static MESSAGE_TIME_ELAPSED_LIMIT_FOR_DELETION = 5 * 60;

   static SALT_ROUND_FOR_USERS_CONTROLLER = 10;

   static VOICE = 'voice';

   static VIDEO = 'video';

   static ZERO_INDEX = 0;

   static TWILIO_VERIFY_CHANNEL = 'sms';

   static ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT = {
      English: 0,
      Turkish: 1,
   };

   static ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT = {
      English: 0,
      Turkish: 1,
   };

   static #ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE = null;

   static get ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE() {
      if (
         ControllerConstants
            .#ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE == null
      ) {
         ControllerConstants.#ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE =
            Object.fromEntries(
               Object.entries(
                  ControllerConstants.ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT,
               ).map(([key, value]) => [value, key]),
            );
      }

      return ControllerConstants
         .#ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT_REVERSE;
   }

   static ASL_TRANSLATION_LANGUAGE_KEY = 'aslTranslationLanguage';
}

module.exports = ControllerConstants;
