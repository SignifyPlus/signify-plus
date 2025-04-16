const LoggerFactory = require('../factories/loggerFactory.js');
const VoiceCallDto = require('../dtos/VoiceCallDto.js');
class VoiceCallSocket {
   constructor(socket, userSocketMap) {
      this.callEvent(socket, userSocketMap);
   }

   async callEvent(socket, userSocketMap) {
      socket.on('voice-call', async (voiceCallData) => {
         const voiceCallDto = new VoiceCallDto(
            voiceCallData?.targetPhoneNumbers,
            voiceCallData?.isCalling,
         );
         try {
            voiceCallDto.targetPhoneNumbers.forEach((targetPhoneNumber) => {});
         } catch (exception) {
            LoggerFactory.getApplicationLogger.error(
               `Exception Occured: ${exception}`,
            );
         }
      });
   }

   async voiceCallFailureEvent(socket, exceptionMessage) {
      socket.emit('voice-call-failure', {
         error: `${exceptionMessage}`,
      });
   }
}

module.exports = VoiceCallSocket;
