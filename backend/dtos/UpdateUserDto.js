class UpdateUserDto {
   constructor(userId, name, phoneNumber, password, profileStatus) {
      this.userId = userId;
      this.name = name;
      this.phoneNumber = phoneNumber;
      this.password = password;
      this.profileStatus = profileStatus;
   }
}

module.exports = UpdateUserDto;
