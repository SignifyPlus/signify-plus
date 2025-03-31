const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
   forumName: { type: String, required: true },
   forumDescription: { type: String, required: true },
   forumStatus: { type: Boolean, required: true },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //the user who created it
   createdAt: { type: Date, required: true, default: Date.now },
});

const Forum = mongoose.model('Forum', ForumSchema);
module.exports = Forum;
