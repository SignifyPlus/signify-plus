const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    mainUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    toUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    lastMessageId : {type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true}, //Message table - foreign key
})

const Chat = mongoose.model("Chat", ChatSchema)
module.exports = Chat;