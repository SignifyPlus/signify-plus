const nosql = require("express")
const mongoose = require("mongoose")
const fs = require('fs');
const User = require("../models/User")
const yaml = require('js-yaml');
const signifyPlusApp = nosql()
//use these for reading connecting string from firebase
mongoose.connect('mongodb+srv://admin:yunogasai9862@signifyplus.pbbbj.mongodb.net/SignifyPlus')
//seprate this out into service, just testing if its working or not

//fetch -- create services now
signifyPlusApp.get("/getUsers", async (request, response) => {
    try {
        
        const users = await User.find().lean();
        response.json(users);
    }catch(exception) {
        response.status(500).json({error: error.message})
    }
})

//create
const createUser = async() => {
    try {
        const user = await User.create({
            userId: 1,
            name: 'Iman zahid',
            phoneNumber :'24125412515',
            passwordHash: 'hashed',
            profilePicture: '.txt',
            createdAt : new Date(),
        })
        console.log('User created:', user);

    } catch (error) {
    console.error('Error creating user:', error);
    }
}
createUser();

signifyPlusApp.listen(3001, () => {
    console.log("Server is Running")
})
