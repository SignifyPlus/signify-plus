const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
   },
   theme: { type: String, enum: ['Light', 'Dark'], default: 'Light' },
   autoDownload: { type: Boolean, default: false },
   notificationEnabled: { type: Boolean, default: true },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

const Settings = mongoose.model('Settings', SettingsSchema);
module.exports = Settings;
