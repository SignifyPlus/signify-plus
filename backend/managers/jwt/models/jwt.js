class JWT {
   constructor(
      accessTokenSecret,
      refreshTokenSecret,
      accessTokenExpirationTime,
      refreshTokenExpirationTime,
   ) {
      this.accessTokenSecret = accessTokenSecret;
      this.refreshTokenSecret = refreshTokenSecret;
      this.accessTokenExpirationTime = accessTokenExpirationTime;
      this.refreshTokenExpirationTime = refreshTokenExpirationTime;
   }
}

module.exports = JWT;
