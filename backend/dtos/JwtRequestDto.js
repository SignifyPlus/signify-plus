class JwtRequestDto {
   constructor(phoneNumber, refreshToken) {
      this.phoneNumber = phoneNumber;
      this.refreshToken = refreshToken;
   }
}

module.exports = JwtRequestDto;
