const LoggerFactory = require('../factories/loggerFactory.js');
const CallDto = require('../dtos/CallDto.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const EventConstants = require('../constants/eventConstants.js');
const MeetingSocketConstants = require('./constants/meetingSocketConstants.js');
const MeetingSocketUtils = require('./utils/meetingSocketUtils.js');
const TimeUtils = require('../utilities/timeUtils.js');
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
   }

   meetingIdEvent(socket, userSocketMap, callSocketMap, meetingParticipantMap) {
      socket.on('meeting-id', (data) => {
         const callDto = new CallDto(
            data?.userPhoneNumber,
            data?.targetPhoneNumbers,
            data?.meetingId,
            data?.isVoiceCall,
            data.isOnCall ?? true, //defaulting to not break the frontend during testing phase for others
            data?.callinitiator,
         );
         LoggerFactory.getApplicationLogger.info(JSON.stringify(callDto));
         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.isVoiceCall == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null ||
            callDto.callinitiator == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `(meeting-id) Please check if userPhoneNumber, targetPhoneNumbers, isVoiceCall, inOnCall, callinitiator and meetingId are provided - One of them seems to be null!`,
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
         meetingParticipantMap.set(callDto.meetingId, {
            participants: [
               callDto.senderPhoneNumber,
               ...callDto.targetPhoneNumbers,
            ],
         });
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
                    callinitiator: callDto.callinitiator,
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
            data?.callinitiator,
         );

         LoggerFactory.getApplicationLogger.info(
            `Meeting ID decline: ${JSON.stringify(callDto)}`,
         );

         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null ||
            callDto.callinitiator == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `(meeting-id-decline) Please check if userPhoneNumber, targetPhoneNumbers, meetingId, callInitiator and isOnCall are provided - One of them seems to be null!`,
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
                    callIniator: data.callinitiator,
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
            data?.callinitiator,
         );

         LoggerFactory.getApplicationLogger.info(
            `Meeting accepted event: ${JSON.stringify(callDto)}`,
         );

         if (
            callDto.senderPhoneNumber == null ||
            callDto.targetPhoneNumbers == null ||
            callDto.meetingId == null ||
            callDto.isOnCall == null ||
            callDto.callinitiator == null
         ) {
            LoggerFactory.getApplicationLogger.error(
               `(meeting-accepted) Please check if userPhoneNumber, targetPhoneNumbers, meetingId, callInitiator and isOnCall are provided - One of them seems to be null!`,
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

         if (
            MeetingSocketUtils.areAllParticipantsOnCall(
               callSocketMap,
               callDto.meetingId,
            )
         ) {
            meetingParticipantMap.set(callDto.meetingId, {
               ...meetingParticipantMap.get(callDto.meetingId),
               ...MeetingSocketUtils.createCallHistoryDto(callDto),
               remainingParticipants: meetingParticipantMap.get(
                  callDto.meetingId,
               ).participants.length,
               callinitiator: callDto.callinitiator,
            });
         }
      });
   }

   participantDisconnectEvent(
      signifyPlusSocketIo,
      disconnectedUserSocketId,
      userSocketMap,
      callSocketMap,
      meetingParticipantMap,
   ) {
      const disconnectedUser = callSocketMap.get(disconnectedUserSocketId);
      if (disconnectedUser) {
         meetingParticipantMap.set(disconnectedUser.meetingId, {
            ...meetingParticipantMap.get(disconnectedUser.meetingId),
            remainingParticipants:
               meetingParticipantMap.get(disconnectedUser.meetingId)
                  .remainingParticipants - 1,
         });
         const participantsObject = meetingParticipantMap.get(
            disconnectedUser.meetingId,
         );

         //normal call history log (accepted, on call, and then left the meeting)
         if (
            participantsObject.allParticipantsOncall &&
            participantsObject.remainingParticipants == 0
         ) {
            const callHistoryDto =
               MeetingSocketUtils.updateCallHistoryDtoForSuccessfulCall(
                  participantsObject,
               );
            EventDispatcher.dispatchEvent(
               EventConstants.CALL_LOG_EVENT,
               callHistoryDto,
            );
         }

         participantsObject.participants.forEach((participant) => {
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
