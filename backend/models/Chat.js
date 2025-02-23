const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    mainUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    participants : [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}], //User table - foreign key
    totalNumberOfMessages : {type: Number, required: false, default: 0}
})

const Chat = mongoose.model("Chat", ChatSchema)
module.exports = Chat;