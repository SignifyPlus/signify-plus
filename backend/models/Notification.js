const mongoose = require('mongoose');

// please use push notifications for real time, and not storing the content of the notification in DB
// we can services like Firebase clound messaging/one signal or pusher
// just use metadata here if needed
const NotificationSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, // user the notification is for
   isRead: { type: Boolean },
   createdAt: { type: Date, required: true, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
