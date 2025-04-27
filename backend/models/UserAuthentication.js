const mongoose = require('mongoose');

const UserAuthenticationSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   isVerified: { type: Boolean, required: true, default: false },
   createdAt: { type: Date, required: true, default: Date.now },
   updatedAt: { type: Date, required: true, default: Date.now },
});

const UserAuthentication = mongoose.model(
   'UserAuthentication',
   UserAuthenticationSchema,
);
module.exports = UserAuthentication;
