const SignifyException = require('../exception/SignifyException.js');
class ExceptionHelper {
   static async validate(
      fieldToCheck,
      failStatusCode,
      message,
      response = null,
   ) {
      if (fieldToCheck === undefined || fieldToCheck === null) {
         const signifyException = new SignifyException(
            failStatusCode,
            `${message}`,
         );
         if (response) {
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }
         return signifyException;
      }

      return null;
   }
}

module.exports = ExceptionHelper;
