const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   type: { type: String, enum: ['image', 'video', 'gif', 'sticker'] },
   media: { type: [String], required: false }, //s3 urls
   createdAt: { type: Date, default: Date.now },
});

const Media = mongoose.model('Media', MediaSchema);
module.exports = Media;
