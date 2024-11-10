const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userId : {type: Number, required: true, unique: true},
    name : {type: String, required: true},
    phoneNumber : {type: String, required: true, unique: true},
    passwordHash : {type: String, required: true},
    profilePicture : {type: String},
    createdAt: {type: Date, required: true}
})

const User = mongoose.model("User", UserSchema)
module.exports = User;