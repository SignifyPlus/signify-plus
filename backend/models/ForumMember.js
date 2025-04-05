const mongoose = require('mongoose');

const ForumMemberSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //the user Id from users table
   forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true,
   }, // which forum id from the forums table
   active: { type: Boolean, required: true, default: true }, //is user active
   isOwner: { type: Boolean, required: true }, //if a user creates a forum, we need to flag that out
   isAdmin: { type: Boolean, required: true, default: false },
   isModerator: { type: Boolean, required: true, default: false },
   joinedAt: { type: Date, required: true, default: Date.now },
   createdAt: { type: Date, required: true, default: Date.now },
});

const ForumMember = mongoose.model('ForumMember', ForumMemberSchema);
module.exports = ForumMember;
