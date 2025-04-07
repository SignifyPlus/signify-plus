const mongoose = require('mongoose');

const ThreadCommentSchema = new mongoose.Schema({
   threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
   },
   commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
   },
   createdAt: { type: Date, required: true, default: Date.now },
});

const ThreadComment = mongoose.model('ThreadComment', ThreadCommentSchema);
module.exports = ThreadComment;
