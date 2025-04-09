const mongoose = require('mongoose');

//messages will be send to Message table - just the metadata - the receiver Id will be the group Id
const GroupSchema = new mongoose.Schema({
   groupName: { type: String, required: true },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }, //the user who created it
   profilePicture: { type: String },
   createdAt: { type: Date, required: true, default: Date.now },
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
