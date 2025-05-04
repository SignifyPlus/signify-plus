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

   static createCallHistoryDto(callDto) {
      return {
         meetingBeginTime: TimeUtils.getCurrentTimeInMilliSeconds(),
         allParticipantsOncall: true,
         isVoiceCall: callDto.isVoiceCall,
      };
   }

   static areAllParticipantsOnCall(callSocketMap, meetingId) {
      const meetingSpecificCallSocketMap = [...callSocketMap.values()].filter(
         (value) => meetingId == value.meetingId,
      );
      return meetingSpecificCallSocketMap.every(
         (value) => meetingId == value.meetingId && value.isOnCall,
      );
   }
}

module.exports = MeetingSocketUtils;
