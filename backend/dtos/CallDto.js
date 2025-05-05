class CallDto {
   constructor(
      senderPhoneNumber,
      targetPhoneNumbers,
      meetingId,
      isVoiceCall,
      isOnCall,
      callinitiator,
   ) {
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
      this.meetingId = meetingId;
      this.isVoiceCall = isVoiceCall;
      this.isOnCall = isOnCall;
      this.callinitiator = callinitiator;
   }
}

module.exports = CallDto;
