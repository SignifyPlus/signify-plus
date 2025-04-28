class UpdateUserDto {
   constructor(userId, name, phoneNumber, password, profilePicture, profileStatus) {
      this.userId = userId;
      this.name = name;
      this.phoneNumber = phoneNumber;
      this.password = password;
      this.profilePicture = profilePicture;
      this.profileStatus = profileStatus;
   }
}

module.exports = UpdateUserDto;
