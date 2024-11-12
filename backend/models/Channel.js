const mongoose = require('mongoose')

const ChannelSchema = new mongoose.Schema({
    channelName: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //the user Id from users table
    createdAt: {type: Date, required: true, default: Date.now}
})

const Channel = mongoose.model("Channel", ChannelSchema)
module.exports = Channel;
