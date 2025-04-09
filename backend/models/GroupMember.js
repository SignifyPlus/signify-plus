const mongoose = require('mongoose');

const GroupMemberSchema = new mongoose.Schema({
   groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
   }, // which group id the user belongs to
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //the user Id from users table
   joinedAt: { type: String },
   createdAt: { type: Date, required: true, default: Date.now },
});

const GroupMember = mongoose.model('GroupMember', GroupMemberSchema);
module.exports = GroupMember;
