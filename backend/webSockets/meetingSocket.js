const LoggerFactory = require('../factories/loggerFactory.js');
class MeetingSocket {
   constructor(socket, userSocketMap) {
      this.meetingIdEvent(socket, userSocketMap);
      this.meetingIdDeclineEvent(socket, userSocketMap);
   }

   meetingIdEvent(socket, userSocketMap) {
      socket.on('meeting-id', (data) => {
         LoggerFactory.getApplicationLogger.info(data);
         const sendersSocketId = userSocketMap[data.userPhoneNumber];
         if (!sendersSocketId) {
            //if sender is undefined, exit
            return;
         }
         LoggerFactory.getApplicationLogger.info(
            `Meeting ID: ${data.meetingId} callerPhoneNumber: ${data.userPhoneNumber} sendersSocketId: ${sendersSocketId} targets: ${data.targetPhoneNumbers}`,
         );
         data.targetPhoneNumbers.forEach((phoneNumber) => {
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
                    senderPhoneNumber: data.userPhoneNumber,
                    meetingId: data.meetingId,
                 }
               : {
                    senderSocketId: socket.id,
                    senderPhoneNumber: data.userPhoneNumber,
                    message: 'Failed! - no user found!',
                 };
            socketEventType.emit(event, payloadBody);
         });
      });
   }

   meetingIdDeclineEvent(socket, userSocketMap) {
      socket.on('meeting-id-decline', (data) => {
         LoggerFactory.getApplicationLogger.info(
            `decline offer ${data.userPhoneNumber} ${data.meetingId} ${data.targetPhoneNumber}`,
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
