const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
   mainUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //User table - foreign key
   participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   ], //User table - foreign key
   createdAt: { type: Date, required: true, default: Date.now },
   // New fields
   isPinned: { type: Boolean, default: false }, // Whether the chat is pinned
   pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who pinned this chat
   lastActivity: { type: Date, default: Date.now }, // For sorting
   isDeleted: { type: Boolean, default: false }, // Soft delete
   deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Users who deleted this chat
   isArchived: { type: Boolean, default: false }, // Archive
   archivedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Users who archived the chat
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
