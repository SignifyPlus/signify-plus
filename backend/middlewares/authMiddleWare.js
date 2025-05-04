const SignifyException = require('../exception/SignifyException.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const AuthConstants = require('./constants/authConstants.js');
const ManagerFactory = require('../factories/managerFactory.js');
class AuthMiddleWare {
   #excludedPaths = null;
   constructor() {
      this.#excludedPaths = [
         AuthConstants.AUTH_USERS_CREATE,
         AuthConstants.AUTH_USERS_LOGIN,
         AuthConstants.JWT_REFRESH,
         AuthConstants.TWILIO_GET,
         AuthConstants.TWILIO_VERIFY,
         AuthConstants.UPDATE_USER
      ];
   }

   async authenticate(request, response, next) {
      if (this.#excludedPaths.some((path) => request.path.includes(path))) {
         LoggerFactory.getApplicationLogger.info(
            `Skipping Path: ${request.path}`,
         );
         return next();
      }
      const authenticationHeader =
         request.headers[AuthConstants.AUTHORIZATION_HEADER];
      if (authenticationHeader == null || authenticationHeader == undefined) {
         const signifyException = new SignifyException(
            403,
            'Authorization header is missing!',
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
      const token = await this.#retrieveToken(authenticationHeader);
      const accessTokenVerification =
         await ManagerFactory.getJwtManager().verifyAccessToken(token);
      if (accessTokenVerification.exception) {
         return response.status(AuthConstants.UNAUTHORIZED).json({
            exception: accessTokenVerification.exception,
            customMessage: `Either login again, or refresh the access token by sending refresh token to the endpoint jwt/refresh`,
            code: 'ACCESS_TOKEN_EXPIRED',
         });
      }

      LoggerFactory.getApplicationLogger.info(
         `Access token is valid: ${JSON.stringify(accessTokenVerification)}`,
      );
      //the validation is done - move to the next one
      next();
   }

   async #retrieveToken(authenticationHeader) {
      const authArray = authenticationHeader.split(' ');
      return authArray.length > 1
         ? authArray[AuthConstants.FIRST]
         : authArray[AuthConstants.ZERO];
   }
}

module.exports = AuthMiddleWare;
