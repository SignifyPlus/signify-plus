class CallDto {
   constructor(senderPhoneNumber, targetPhoneNumbers, meetingId, isVoiceCall) {
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
      this.meetingId = meetingId;
      this.isVoiceCall = isVoiceCall;
   }
}

module.exports = CallDto;
