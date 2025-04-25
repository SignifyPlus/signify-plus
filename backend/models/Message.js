const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
   senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //User table - foreign key
   receiverIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   ], //User table - foreign key
   chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
   }, //Chat table - foreign key
   mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: false,
   }, //Media table - foreign key
   messageType: { type: String },
   content: { type: String, required: true },
   status: { type: Boolean }, //delivered or not
   createdAt: { type: Date, required: true, default: Date.now },
    // New fields for reply functionality
   replyToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: false,
   }, // Reference to the parent message
   isEdited: { type: Boolean, default: false }, // Track if message was edited
   isPinned: { type: Boolean, default: false }, // Track if message is pinned
   isDeleted: { type: Boolean, default: false }, // Soft delete flag
   isRead: { type: Boolean, default: false }, // Read status
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
