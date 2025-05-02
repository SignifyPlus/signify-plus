class CallDto {
   constructor(
      senderPhoneNumber,
      targetPhoneNumbers,
      meetingId,
      isVoiceCall,
      isOnCall,
      callTime = 0,
   ) {
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
      this.meetingId = meetingId;
      this.isVoiceCall = isVoiceCall;
      this.isOnCall = isOnCall;
      this.callTime = callTime;
   }
}

module.exports = CallDto;
