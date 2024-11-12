const mongoose = require('mongoose')

const ChannelSubscriberSchema = new mongoose.Schema({
    channelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true}, // to which channel belongs to
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //the user Id from users table
    status: {type: Boolean, required: true},
    subscribedAt: {type: Date, required: true, default: Date.now}
})

const ChannelSubscriber = mongoose.model("ChannelSubscriber", ChannelSubscriberSchema)
module.exports = ChannelSubscriber;
