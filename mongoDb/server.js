const nosql = require("express")
const mongoose = require("mongoose")
const fs = require('fs');
const collection = require("../models/User")
const yaml = require('js-yaml');
const signifyPlusApp = nosql()
//use these for reading connecting string from firebase
mongoose.connect('mongodb+srv://admin:yunogasai9862@signifyplus.pbbbj.mongodb.net/SignifyPlus')

//seprate this out into service, just testing if its working or not
signifyPlusApp.get("/getUsers", (request, response) => {
    response.json(collection.User.find())
})

signifyPlusApp.listen(3001, () => {
    console.log("Server is Running")
})
