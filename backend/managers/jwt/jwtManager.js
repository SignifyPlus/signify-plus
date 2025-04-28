const LoggerFactory = require('../../factories/loggerFactory.js');
const JsonWebToken = require('jsonwebtoken');
const JWT = require('./models/jwt.js');
class JwtManager {
   /**
    * @type {JWT | null}
    */
   #jwtDto = null;
   constructor() {}

   async setJwtDto(
      accessTokenSecret,
      refreshTokenSecret,
      accessTokenExpirationTime,
      refreshTokenExpirationTime,
   ) {
      LoggerFactory.getApplicationLogger.info(`Creating JWT dto...`);
      if (
         accessTokenSecret == null ||
         refreshTokenSecret == null ||
         accessTokenExpirationTime == null ||
         refreshTokenExpirationTime == null
      ) {
         LoggerFactory.getApplicationLogger
            .error(`One or more environment variables are not set: {JWT_SECRET_ACCESS_TOKEN_SECRET_KEY_ENCRYPTED} 
                    {JWT_SECRET_REFRESH_TOKEN_SECRET_KEY} {JWT_ACCESS_TOKEN_EXPIRATION_IN_SECONDS} {JWT_REFRESH_TOKEN_EXPIRATION_IN_SECONDS} -- kindly check!`);
         return;
      }

      this.#jwtDto = new JWT(
         accessTokenSecret,
         refreshTokenSecret,
         accessTokenExpirationTime,
         refreshTokenExpirationTime,
      );
   }

   async generateAccessToken(userId) {
      const accessToken = JsonWebToken.sign(
         { userId },
         this.#jwtDto.accessTokenSecret,
         { expiresIn: this.#jwtDto.accessTokenExpirationTime },
      );
      LoggerFactory.getApplicationLogger.info(
         `RefreshToken: ${accessToken} generated for the userId: ${userId}`,
      );
      return accessToken;
   }

   async generateRefreshToken(userId) {
      const refreshToken = JsonWebToken.sign(
         { userId },
         this.#jwtDto.refreshTokenSecret,
         { expiresIn: this.#jwtDto.refreshTokenExpirationTime },
      );
      LoggerFactory.getApplicationLogger.info(
         `RefreshToken: ${refreshToken} generated for the userId: ${userId}`,
      );
      return refreshToken;
   }

   async verifyAccessToken(accessToken) {
      try {
         const isValid = JsonWebToken.verify(
            accessToken,
            this.#jwtDto.accessTokenSecret,
         );
         LoggerFactory.getApplicationLogger.info(
            `IsAccessTokenValid: ${isValid}`,
         );
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(
            `Exception Occured while verifying the access token: ${exception}`,
         );
         throw new Error(exception);
      }
   }

   async verifyRefreshToken(refreshToken) {
      try {
         const isValid = JsonWebToken.verify(
            refreshToken,
            this.#jwtDto.refreshTokenSecret,
         );
         LoggerFactory.getApplicationLogger.info(
            `IsRefreshTokenValid: ${isValid}`,
         );
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(
            `Exception Occured while verifying the refresh token: ${exception}`,
         );
         throw new Error(exception);
      }
   }
}

module.exports = JwtManager;
