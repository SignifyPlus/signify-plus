const mongoose = require('mongoose')

const ForumMemberSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //the user Id from users table
    forumId: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true}, // which forum id from the forums table
    joinedAt : {type: String},
    createdAt: {type: Date, required: true, default: Date.now}
})

const ForumMember = mongoose.model("ForumMember", ForumMemberSchema)
module.exports = ForumMember;
