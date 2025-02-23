const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    senderId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //User table - foreign key
    receiverIds : [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}], //User table - foreign key
    chatId : {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true}, //Chat table - foreign key
    mediaId : {type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: false}, //Media table - foreign key
    messageType: {type: String},
    content: {type: String, required: true},
    status: {type: Boolean}, //delivered or not
    createdAt: {type: Date, required: true, default: Date.now}
})

const Message = mongoose.model("Message", MessageSchema)
module.exports = Message;