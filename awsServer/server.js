const mysql = require("mysql")
//TODO : fetch from Firebase secret manager (free)
const signifyPlusDb = mysql.createConnection({
    host : "signify-plus-db.c7gou8oq62vc.eu-north-1.rds.amazonaws.com", 
    port : "3306",
    user: "",
    password: "",
    database: "",
})