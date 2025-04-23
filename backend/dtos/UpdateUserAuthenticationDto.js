class UpdateUserAuthenticationDto {
   constructor(phoneNumber, isVerified) {
      this.phoneNumber = phoneNumber;
      this.isVerified = isVerified;
   }
}

module.exports = UpdateUserAuthenticationDto;
