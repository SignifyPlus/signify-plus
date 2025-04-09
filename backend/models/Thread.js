const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
   title: { type: String },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   active: {
      type: Boolean,
      required: true,
      default: true,
   },
   createdAt: { type: Date, required: true, default: Date.now },
});

const Thread = mongoose.model('Thread', ThreadSchema);
module.exports = Thread;
