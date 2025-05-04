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
   updatedAt: { type: Date, required: true, default: Date.now },
   // New fields
   pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who pinned this chat
   lastActivity: { type: Date, default: Date.now }, // For sorting
   deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Users who deleted this chat
   archivedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Users who archived the chat
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
