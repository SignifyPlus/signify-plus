const mongoose = require('mongoose');

const ForumThreadSchema = new mongoose.Schema({
   forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true,
   },
   threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
   },
   createdAt: { type: Date, required: true, default: Date.now },
});

const ForumThread = mongoose.model('ForumThread', ForumThreadSchema);
module.exports = ForumThread;
