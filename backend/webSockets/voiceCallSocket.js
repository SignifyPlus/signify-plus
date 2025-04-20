const LoggerFactory = require('../factories/loggerFactory.js');
const VoiceCallDto = require('../dtos/VoiceCallDto.js');
const { json } = require('stream/consumers');
class VoiceCallSocket {
   constructor(socket, userSocketMap) {
      this.callEvent(socket, userSocketMap);
      this.incomingCallResolution(socket, userSocketMap);
   }

   async callEvent(socket, userSocketMap) {
      socket.on('voice-call-initiated', async (voiceCallData) => {
         const voiceCallDto = new VoiceCallDto(
            voiceCallData?.senderPhoneNumber,
            voiceCallData?.targetPhoneNumbers,
         );
         LoggerFactory.getApplicationLogger.info(
            `Voice Call - ${JSON.stringify(voiceCallDto)}`,
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

   async incomingCallResolution(socket, userSocketMap) {
      socket.on('incoming-call-resolution', async (data) => {
         if (userSocketMap[data.targetPhoneNumber] == null) {
            LoggerFactory.getApplicationLogger.info(
               `targetPhoneNumber is not registered to the socket - ${targetPhoneNumber} terminating the event`,
            );
            return;
         }
         LoggerFactory.getApplicationLogger.info(
            `incoming-call-resolution - ${JSON.stringify(data)}`,
         );
         socket
            .to(userSocketMap[data.targetPhoneNumber])
            .emit('incoming-call-resolution', data);
      });
   }

   async voiceCallFailureEvent(socket, exceptionMessage) {
      socket.emit('voice-call-failure', {
         error: `${exceptionMessage}`,
      });
   }
}

module.exports = VoiceCallSocket;
