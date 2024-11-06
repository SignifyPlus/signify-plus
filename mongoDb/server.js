const mysql = require("express")
const mongoose = require("mongoose")
const fs = require('fs');
const yaml = require('js-yaml');

const signifyPlusApp = express()

//use these for reading connecting string from firebase
mongoose.connect('mongodb+srv://admin:yunogasai9862@signifyplus.pbbbj.mongodb.net/SignifyPlus')

signifyPlusApp.listen(3001, () => {
    console.log("Server is Running")
})
