const ControllerFactory = require('../../factories/controllerFactory.js');
const ServiceFactory = require('../../factories/serviceFactory.js');
const mongoose = require('mongoose');
const MeetingSocketConstants = require('../constants/meetingSocketConstants.js');
const TimeUtils = require('../../utilities/timeUtils.js');

class MeetingSocketUtils {
   static updateCallHistoryDtoForSuccessfulCall(participantsDto) {
      participantsDto.meetingEndTime = TimeUtils.getCurrentTimeInMilliSeconds();
      participantsDto.totalDurationInSeconds = TimeUtils.getTimeInSeconds(
         Math.abs(
            participantsDto.meetingEndTime - participantsDto.meetingBeginTime,
         ),
      );
      participantsDto.BeginDateTime = TimeUtils.getDateFromTimeStamp(
         participantsDto.meetingBeginTime,
         MeetingSocketConstants.DATE_FORMAT,
      );
      participantsDto.status = MeetingSocketConstants.ACCEPTED;
      return participantsDto;
   }

   static updateCallHistoryDtoForDeclinedCall(participantsDto) {
      participantsDto.meetingEndTime = 0;
      participantsDto.totalDurationInSeconds = 0;
      participantsDto.BeginDateTime = TimeUtils.getDateFromTimeStamp(
         participantsDto.meetingBeginTime,
         MeetingSocketConstants.DATE_FORMAT,
      );
      participantsDto.status = MeetingSocketConstants.DECLINED;
      return participantsDto;
   }

   static createAcceptedCallHistoryDto(callDto) {
      return {
         meetingBeginTime: TimeUtils.getCurrentTimeInMilliSeconds(),
         allParticipantsOncall: true,
         isVoiceCall: callDto.isVoiceCall,
      };
   }

   static createDeclineCallHistoryDto(callDto) {
      return {
         meetingBeginTime: TimeUtils.getCurrentTimeInMilliSeconds(),
         allParticipantsOncall: false,
         isVoiceCall: callDto.isVoiceCall,
      };
   }

   static areAllParticipantsOnCall(callSocketMap, meetingId) {
      const meetingSpecificCallSocketMap =
         MeetingSocketUtils.#getMeetingSpecificSocket(callSocketMap, meetingId);
      return meetingSpecificCallSocketMap.every((value) => value.isOnCall);
   }

   static areAllTargetPhoneNumbersNotOnCall(callSocketMap, meetingId) {
      const meetingSpecificCallSocketMap =
         MeetingSocketUtils.#getMeetingSpecificSocket(callSocketMap, meetingId);
      //first filter, then use every!
      return meetingSpecificCallSocketMap
         .filter((user) => user.callInitiator != user.senderPhoneNumber)
         .every((value) => !value.isOnCall);
   }

   static isSenderNotOnTheCall(callSocketMap, meetingId) {
      const meetingSpecificCallSocketMap =
         MeetingSocketUtils.#getMeetingSpecificSocket(callSocketMap, meetingId);
      return meetingSpecificCallSocketMap
         .filter((user) => user.callInitiator == user.senderPhoneNumber)
         .every((value) => !value.isOnCall);
   }

   static #getMeetingSpecificSocket(callSocketMap, meetingId) {
      return [...callSocketMap.values()].filter(
         (value) => meetingId == value.meetingId,
      );
   }
}

module.exports = MeetingSocketUtils;
