const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
   messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   type: { type: String, enum: ['like', 'love', 'laugh'] },
   createdAt: { type: Date, default: Date.now },
});

const Reaction = mongoose.model('Reaction', ReactionSchema);
module.exports = Reaction;
