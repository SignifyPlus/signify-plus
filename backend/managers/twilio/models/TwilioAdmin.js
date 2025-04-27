const CommonUtils = require('../../../utilities/commonUtils.js');
class TwilioAdmin {
   constructor(accountSid, authToken) {
      this.accountSid = accountSid;
      this.authToken = authToken;
   }

   getDecryptedAuthToken() {
      return CommonUtils.decodeFromBase64(this.authToken);
   }

   getDecryptedAccountSid() {
      return CommonUtils.decodeFromBase64(this.accountSid);
   }
}

module.exports = TwilioAdmin;
