const LoggerFactory = require("../../factories/loggerFactory.js");
const CommonUtils = require("../../utilities/commonUtils.js");
const admin = require("firebase-admin");
const FirebaseAdmin = require("./models/FirebaseAdmin.js");
class FirebaseManager{
    #firebaseCreds;
    #adminSdk;
    constructor() {
        this.#setFirebaseCreds.bind(this);
        this.getfirebaseAdminSdk.bind(this);
    }

    async #setFirebaseCreds(base64Creds) {
        this.#firebaseCreds = new FirebaseAdmin(JSON.parse(await CommonUtils.decodeFromBase64(base64Creds)));
        LoggerFactory.getApplicationLogger.info(`Firebase Credentials are all set!`);
    }

    async connectToFireBase(base64Creds){
        try {
            //set creds first
            await this.#setFirebaseCreds(base64Creds);
            //then initialize the firebase admin
            //this expects a javascript object, not a string, hence firebaseCreds decoded string needs to be parsed to JSON first
            this.#adminSdk = admin.initializeApp({
                credential: admin.credential.cert(this.#firebaseCreds)
            });
            LoggerFactory.getApplicationLogger.info(`The Admin SDK is connected!`);
        }catch (exception) {
            LoggerFactory.getApplicationLogger.error(`Firebase Exception: ${exception}`);
            throw exception;
        }
    }

    async getfirebaseAdminSdk() {
        return this.#adminSdk;
    }
}

module.exports = FirebaseManager;
