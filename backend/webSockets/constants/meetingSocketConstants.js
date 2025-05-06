const ControllerFactory = require('../../factories/controllerFactory.js');
const ServiceFactory = require('../../factories/serviceFactory.js');
const mongoose = require('mongoose');

class MeetingSocketConstants {
   static ACCEPTED = 'accepted';
   static DECLINED = 'declined';
   static MISSED = 'missed';
   static DATE_FORMAT = 'yyyy-MM-dd HH:mm a';
}

module.exports = MeetingSocketConstants;
