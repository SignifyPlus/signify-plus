const mongoose = require('mongoose');

const CallHistorySchema = new mongoose.Schema({
   initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, // the user Id from users table
   participants: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
   ], // the user Id from users table
   callType: { type: String, enum: ['voice', 'video'], required: true },
   callDurationInSeconds: { type: Number, default: 0 },
   callStatus: {
      type: String,
      enum: ['declined', 'missed', 'accepted'],
      required: true,
   },
   initiatedAt: { type: String, required: true },
   deletedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   ],
   createdAt: { type: Date, required: true, default: Date.now },
   updatedAt: { type: Date, required: true, default: Date.now },
});

const CallHistory = mongoose.model('CallHistory', CallHistorySchema);
module.exports = CallHistory;
