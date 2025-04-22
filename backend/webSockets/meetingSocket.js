const LoggerFactory = require('../factories/loggerFactory.js');
const CallDto = require('../dtos/CallDto.js');
class MeetingSocket {
   constructor(socket, userSocketMap) {
      this.meetingIdEvent(socket, userSocketMap);
      this.meetingIdDeclineEvent(socket, userSocketMap);
   }

   meetingIdEvent(socket, userSocketMap) {
      socket.on('meeting-id', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
         );
         LoggerFactory.getApplicationLogger.info(JSON.stringify(callDto));
         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.isVoiceCall == null ||
            callDto.meetingId == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumbers, isVoiceCall, and meetingId are provided - One of them seems to be null!`,
            );
            return;
         }

         const sendersSocketId = userSocketMap[callDto.senderPhoneNumber];
         if (!sendersSocketId) {
            //if sender is undefined, exit
            return;
         }
         LoggerFactory.getApplicationLogger.info(
            `Meeting ID: ${callDto.meetingId} callerPhoneNumber: ${callDto.senderPhoneNumber} sendersSocketId: ${sendersSocketId} targets: ${callDto.targetPhoneNumbers}`,
         );
         callDto.targetPhoneNumbers.forEach((phoneNumber) => {
            const targetSocketId = userSocketMap[phoneNumber];
            LoggerFactory.getApplicationLogger.info(
               `Iterating ${targetSocketId}`,
            );
            const event = targetSocketId
               ? 'meeting-id-offer'
               : 'meeting-id-failed';
            const socketEventType = targetSocketId
               ? socket.to(targetSocketId)
               : socket;
            const payloadBody = targetSocketId
               ? {
                    senderSocketId: socket.id,
                    senderPhoneNumber: callDto.senderPhoneNumber,
                    meetingId: callDto.meetingId,
                    isVoiceCall: callDto.isVoiceCall,
                 }
               : {
                    senderSocketId: socket.id,
                    senderPhoneNumber: callDto.senderPhoneNumber,
                    message: 'Failed! - no user found!',
                 };
            socketEventType.emit(event, payloadBody);
         });
      });
   }

   meetingIdDeclineEvent(socket, userSocketMap) {
      socket.on('meeting-id-decline', (data) => {
         if (
            data.userPhoneNumber == null ||
            data.meetingId == null ||
            data.targetPhoneNumber == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumber, and meetingId are provided for the decline event - One of them seems to be null!`,
            );
            return;
         }
         LoggerFactory.getApplicationLogger.info(
            `decline offer from: ${data.userPhoneNumber} meetingId: ${data.meetingId} target: ${data.targetPhoneNumber}`,
         );
         //send the decline offer to the targetPhoneNumber
         //find the user from the map
         const targetPhoneNumberSocketId =
            userSocketMap[data.targetPhoneNumber];

         const event = targetPhoneNumberSocketId
            ? 'call-declined'
            : 'meeting-id-decline-failed';
         const socketEventType = targetPhoneNumberSocketId
            ? socket.to(targetPhoneNumberSocketId)
            : socket;
         const payloadBody = targetPhoneNumberSocketId
            ? {
                 sender: socket.id,
                 declinedUsersPhoneNumber: data.userPhoneNumber,
                 message: 'Call Declined!',
              }
            : {
                 sender: socket.id,
                 senderPhoneNumber: data.userPhoneNumber,
                 message: `Failed! - no user found with ${data.targetPhoneNumber}`,
              };
         socketEventType.emit(event, payloadBody);
      });
   }
}

module.exports = MeetingSocket;
