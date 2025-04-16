class VoiceCallDto {
   constructor(senderPhoneNumber, targetPhoneNumbers) {
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
   }
}

module.exports = VoiceCallDto;
