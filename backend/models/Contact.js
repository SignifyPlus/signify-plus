const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   contactUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   status: { type: Boolean, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
});

//uniqueness to combat race conditions based on milliseconds
ContactSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
