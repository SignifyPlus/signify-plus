const LoggerFactory = require("../factories/loggerFactory.js");
const CommonUtils = require("../utilities/commonUtils.js");
const admin = require("firebase-admin");
require("dotenv").config();
class FirebaseManager{
    #firebaseCreds;
    #adminSdk;
    constructor() {
        this.setFirebaseCreds.bind(this);
    }

    async setFirebaseCreds() {
        this.#firebaseCreds = await CommonUtils.decodeFromBase64(process.env.FIRE_BASE_AUTHENTICATION_CREDS);
        LoggerFactory.getApplicationLogger.info(`Firebase Creds: ${this.#firebaseCreds}`);
    }

    async connectToFireBase(){
        this.#adminSdk = admin.initializeApp({
            credential: admin.credential.cert(this.#firebaseCreds)
        });
    }

    get getfirebaseAdminSdk() {
        return this.#adminSdk;
    }
}

module.exports = FirebaseManager;
