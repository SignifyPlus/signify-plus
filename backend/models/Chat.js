const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    mainUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    participants : [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}], //User table - foreign key
    createdAt: {type: Date, required: true, default: Date.now}
})

const Chat = mongoose.model("Chat", ChatSchema)
module.exports = Chat;