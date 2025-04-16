const LoggerFactory = require('../factories/loggerFactory.js');
const VoiceCallDto = require('../dtos/VoiceCallDto.js');
class VoiceCallSocket {
   constructor(socket, userSocketMap) {
      this.callEvent(socket, userSocketMap);
   }

   async callEvent(socket, userSocketMap) {
      socket.on('voice-call', async (voiceCallData) => {
         const voiceCallDto = new VoiceCallDto(
            voiceCallData?.senderPhoneNumber,
            voiceCallData?.targetPhoneNumbers,
         );
         try {
            voiceCallDto.targetPhoneNumbers.forEach((targetPhoneNumber) => {
               if (userSocketMap[targetPhoneNumber] == null) {
                  LoggerFactory.getApplicationLogger.info(
                     `targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`,
                  );
                  return;
               }
               socket
                  .to(userSocketMap[targetPhoneNumber])
                  .emit('incoming-call', {
                     senderPhoneNumber: voiceCallData.senderPhoneNumber,
                     incomingCall: true,
                  });
            });
         } catch (exception) {
            LoggerFactory.getApplicationLogger.error(
               `Exception Occured: ${exception}`,
            );
            this.voiceCallFailureEvent(socket, exception);
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
