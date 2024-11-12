const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    senderId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    receiverId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    messageType: {type: String},
    content: {type: String, required: true},
    media: {type: [String], required: false}, //s3 urls
    status: {type: Boolean}, //delivered or not
    createdAt: {type: Date, required: true, default: Date.now}
})

const Message = mongoose.model("Message", MessageSchema)
module.exports = Message;