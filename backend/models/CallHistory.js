const mongoose = require('mongoose')

const CallHistorySchema = new mongoose.Schema({
    callerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // the user Id from users table
    recieverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // the user Id from users table
    callType: {type: String, enum: ['voice', 'video'], required: true},
    callDuration: {type: Number, default: 0},
    callStatus: {type: String, enum: ['declined', 'missed', 'accepted'], required: true},
    createdAt: {type: Date, required: true, default: Date.now}
})

const CallHistory = mongoose.model("CallHistory", CallHistorySchema)
module.exports = CallHistory;