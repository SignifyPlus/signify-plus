class UpdateUserAuthenticationDto {
   constructor(phoneNumber, isVerified, refreshToken) {
      this.phoneNumber = phoneNumber;
      this.isVerified = isVerified;
      this.refreshToken = refreshToken;
   }
}

module.exports = UpdateUserAuthenticationDto;
