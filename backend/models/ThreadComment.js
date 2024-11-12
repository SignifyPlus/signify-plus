const mongoose = require('mongoose')

const ThreadCommentSchema = new mongoose.Schema({
    threadId: {type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true}, // comment relating to which thread
    content: {type: String, required: true},
    media: {type: [String], required: false}, //s3 urls
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //the user Id from users table
    createdAt: {type: Date, required: true, default: Date.now}
})

const ThreadComment = mongoose.model("ThreadComment", ThreadCommentSchema)
module.exports = ThreadComment;
