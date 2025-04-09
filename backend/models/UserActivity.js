const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   type: { type: String, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
});

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);
module.exports = UserActivity;
