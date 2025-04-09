const mongoose = require('mongoose');

const ForumPermissionsSchema = new mongoose.Schema({
   forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true,
   }, // which forum id from the forums table
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //the user who created it
   canPost: { type: Boolean, required: true },
   canModerate: { type: Boolean, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
});

const ForumPermissions = mongoose.model(
   'ForumPermissions',
   ForumPermissionsSchema,
);
module.exports = ForumPermissions;
