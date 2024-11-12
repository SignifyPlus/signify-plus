const mongoose = require('mongoose')

const ForumThreadSchema = new mongoose.Schema({
    forumId: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true}, // which forum id from the forums table
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //the user Id from users table
    title: {type: String},
    createdAt: {type: Date, required: true, default: Date.now}
})

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema)
module.exports = ForumThread;
