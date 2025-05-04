/**
 * TimeUtils - A utility class for working with time-related functions.
 * This is a static class that provides methods to retrieve current time.
 * Methods:
 *  - getCurrentTimeInMilliSeconds(): Returns the current timestamp in milliseconds.
 *  - getCurrentTimeInSeconds(): Returns the current timestamp in seconds.
 *  - getTimeDifferenceInSecondsFromNow(): Returns time difference from the given time in seconds and now
 *  - getTimeInSeconds(): converts any time in milliseconds to seconds
 * - isTimeDifferenceGreaterThanElapsedLimit(): Returns true/false depending on if the time difference is greater than elapsedLimit
 */
const { format } = require('date-fns');
const LoggerFactory = require('../factories/loggerFactory.js');
class TimeUtils {
   static getCurrentTimeInMilliSeconds() {
      return Date.now();
   }

   static getCurrentTimeInSeconds() {
      return Math.floor(Date.now() / 1000.0);
   }

   static getTimeDifferenceInSecondsFromNow(fromInSeconds) {
      return Math.abs(this.getCurrentTimeInSeconds() - fromInSeconds);
   }

   static getTimeInSeconds(timeInMilliseconds) {
      return Math.floor(timeInMilliseconds / 1000.0);
   }

   static isTimeDifferenceLessThanElapsedLimit(
      elapsedLimitInSeconds,
      fromInSeconds,
   ) {
      return (
         elapsedLimitInSeconds >
         this.getTimeDifferenceInSecondsFromNow(fromInSeconds)
      );
   }

   static getDateFromTimeStamp(timeStamp, dateFromat) {
      try {
         const date = new Date(timeStamp);
         return format(date, dateFromat);
      } catch (exception) {
         LoggerFactory.getApplicationLogger.error(
            `Failed to format the date ${date} to: ${dateFormat} - exception occured: ${exception}`,
         );
      }
   }
}

module.exports = TimeUtils;
