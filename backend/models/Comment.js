const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
   content: { type: String, required: true },
   mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: false,
   },
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

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
