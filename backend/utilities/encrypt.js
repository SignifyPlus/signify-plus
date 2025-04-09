const bcrypt = require('bcrypt');
class Encrypt {
   static async encrypt(saltRound, keyToEncrypt) {
      return await bcrypt.hash(keyToEncrypt, saltRound);
   }

   static async compare(rawValue, hashedValue) {
      return await bcrypt.compare(rawValue, hashedValue);
   }
}

module.exports = Encrypt;
