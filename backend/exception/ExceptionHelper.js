const SignifyException = require('../exception/SignifyException.js');
class ExceptionHelper {
   static async validate(fieldToCheck, failStatusCode, message, response) {
      if (fieldToCheck === undefined || fieldToCheck === null) {
         const signifyException = new SignifyException(
            failStatusCode,
            `${message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }

      return null;
   }

   static async validate(fieldToCheck, failStatusCode, message) {
      if (fieldToCheck === undefined || fieldToCheck === null) {
         return new SignifyException(failStatusCode, `${message}`);
      }
      return null;
   }
}

module.exports = ExceptionHelper;
