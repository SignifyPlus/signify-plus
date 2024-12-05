const webpush = require('web-push');
const bodyParser = require('body-parser');

class NotificationPushManager {
    constructor(applicationServer, vapidPublicKey, vapidPrivateKey) {
        this.vapidPrivateKey = vapidPrivateKey;
        this.vapidPublicKey = vapidPublicKey;
        this.applicationServer = applicationServer;
        this.setupVapidDetails();
    }

    setupVapidDetails() {
        webpush.setVapidDetails(
            process.env.EMAIL,
            this.vapidPublicKey,
            this.vapidPrivateKey
        )
    }

    post(){
        this.applicationServer.post('/subscribe', (req, res) => {

        });
    }
    
}

module.exports = NotificationPushManager;


