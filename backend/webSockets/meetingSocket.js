const LoggerFactory = require('../factories/loggerFactory.js');
const CallDto = require('../dtos/CallDto.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
class MeetingSocket {
   constructor(socket, userSocketMap, callSocketMap, meetingParticipantMap) {
      this.meetingIdEvent(
         socket,
         userSocketMap,
         callSocketMap,
         meetingParticipantMap,
      );
      this.meetingIdDeclineEvent(
         socket,
         userSocketMap,
         callSocketMap,
         meetingParticipantMap,
      );
      this.meetingAcceptedEvent(
         socket,
         userSocketMap,
         callSocketMap,
         meetingParticipantMap,
      );

      this.meetingEndedEvent(
         socket,
         userSocketMap,
         callSocketMap,
         meetingParticipantMap,
      );
   }

   meetingIdEvent(socket, userSocketMap, callSocketMap, meetingParticipantMap) {
      socket.on('meeting-id', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
            data.isOnCall ?? true, //defaulting to not break the frontend during testing phase for others
         );
         LoggerFactory.getApplicationLogger.info(JSON.stringify(callDto));
         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.isVoiceCall == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumbers, isVoiceCall, inOnCall and meetingId are provided - One of them seems to be null!`,
            );
            return;
         }

         const sendersSocketId = userSocketMap.get(callDto.senderPhoneNumber);
         if (!sendersSocketId) {
            socket.emit(`meeting-id-failed`, {
               senderPhoneNumber: callDto.senderPhoneNumber,
               message: `NO_USER_FOUND`,
            });
         }
         callSocketMap.set(sendersSocketId, {
            meetingId: callDto.meetingId,
            isOnCall: callDto.isOnCall,
         });
         meetingParticipantMap.set(callDto.meetingId, [
            callDto.senderPhoneNumber,
            ...callDto.targetPhoneNumbers,
         ]);
         LoggerFactory.getApplicationLogger.info(
            `Meeting ID: ${callDto.meetingId} callerPhoneNumber: ${callDto.senderPhoneNumber} sendersSocketId: ${sendersSocketId} targets: ${callDto.targetPhoneNumbers}`,
         );
         callDto.targetPhoneNumbers.forEach((phoneNumber) => {
            const targetSocketId = userSocketMap.get(phoneNumber);
            if (targetSocketId) {
               callSocketMap.set(targetSocketId, {
                  meetingId: callDto.meetingId,
               });
            }
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
                    targetPhoneNumbers: [
                       callDto.senderPhoneNumber,
                       ...callDto.targetPhoneNumbers.filter(
                          (number) => phoneNumber != number,
                       ),
                    ],
                    meetingId: callDto.meetingId,
                    isVoiceCall: callDto.isVoiceCall,
                 }
               : {
                    targetPhoneNumber: phoneNumber,
                    senderSocketId: socket.id,
                    senderPhoneNumber: callDto.senderPhoneNumber,
                    message: `NO_USER_FOUND`,
                 };
            socketEventType.emit(event, payloadBody);
         });
      });
   }

   meetingIdDeclineEvent(
      socket,
      userSocketMap,
      callSocketMap,
      meetingParticipantMap,
   ) {
      socket.on('meeting-id-decline', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
            data.isOnCall ?? false, //defaulting to not break the frontend during testing phase for others
         );

         LoggerFactory.getApplicationLogger.info(
            `Meeting ID decline: ${JSON.stringify(callDto)}`,
         );

         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumbers, meetingId and isOnCall are provided - One of them seems to be null!`,
            );
            return;
         }
         LoggerFactory.getApplicationLogger.info(
            `decline offer from: ${callDto.senderPhoneNumber} meetingId: ${callDto.meetingId} target: ${callDto.targetPhoneNumbers}`,
         );

         callDto.targetPhoneNumbers.forEach((targetPhoneNumber) => {
            const targetPhoneNumberSocketId =
               userSocketMap.get(targetPhoneNumber);

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
                    targetPhoneNumber: targetPhoneNumber,
                    sender: socket.id,
                    senderPhoneNumber: data.userPhoneNumber,
                    message: `NO_USER_FOUND`,
                 };
            socketEventType.emit(event, payloadBody);
         });
      });
   }

   meetingAcceptedEvent(
      socket,
      userSocketMap,
      callSocketMap,
      meetingParticipantMap,
   ) {
      socket.on('meeting-accepted', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
            data.isOnCall ?? true, //defaulting to not break the frontend during testing phase for others
         );

         LoggerFactory.getApplicationLogger.info(
            `Meeting accepted event: ${JSON.stringify(callDto)}`,
         );

         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumbers, meetingId and isOnCall are provided - One of them seems to be null!`,
            );
            return;
         }
         const sendersSocketId = userSocketMap.get(callDto.senderPhoneNumber);
         if (!sendersSocketId) {
            socket.emit(`meeting-id-failed`, {
               senderPhoneNumber: callDto.senderPhoneNumber,
               message: `NO_USER_FOUND`,
            });
         }

         callSocketMap.set(sendersSocketId, {
            meetingId: callDto.meetingId,
            isOnCall: callDto.isOnCall,
         });

         //continue tomorrow
         console.log([...callSocketMap.values()]);
      });
   }

   //ALSO SEEMS LIKE THIS EVENT WILL NOT BE HERE BECAUSE AS SOON AS THE USER ARE OFF THE CALL
   //THE SOCKET CONNECTION DISAPPEARS/DISSOVLES, SO WE MIGHT NEED TO DO THIS OUTSIDE OF THIS CLASS (WHERE WE ARE DOING DISCONNECT, ETC)
   //BUT WE'LL SEE TOMORROW
   meetingEndedEvent(
      socket,
      userSocketMap,
      callSocketMap,
      meetingParticipantMap,
   ) {
      //this must be call only ONCE - emitted by the frontend that the call is done
      socket.on('meeting-ended', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
         );

         LoggerFactory.getApplicationLogger.info(
            `Meeting ended event: ${JSON.stringify(callDto)}`,
         );

         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.meetingId == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `Please check if userPhoneNumber, targetPhoneNumbers, and meetingId are provided - One of them seems to be null!`,
            );
            return;
         }
         //TODO - Emit an event to log a call record in the call history table
         EventDispatcher.dispatchEvent(EventConstants.CALL_LOG_EVENT, {});
      });
   }

   participantDisconnectEvent(
      signifyPlusSocketIo,
      disconnectedUserSocketId,
      userSocketMap,
      callSocketMap,
      meetingParticipantMap,
   ) {
      //disseminate the meeting id event, if any
      const disconnectedUser = callSocketMap.get(disconnectedUserSocketId);
      if (disconnectedUser) {
         const participants = meetingParticipantMap.get(
            disconnectedUser.meetingId,
         );
         participants.forEach((participant) => {
            const socketId = userSocketMap.get(participant);
            if (socketId && socketId != disconnectedUserSocketId) {
               signifyPlusSocketIo
                  .to(socketId)
                  .emit(`user-disconnected-from-meeting`, {
                     mesage: `User with the socketId: ${disconnectedUserSocketId} disconnected`,
                     meetingId: disconnectedUser.meetingId,
                  });
            }
         });
      }
   }
}

module.exports = MeetingSocket;
