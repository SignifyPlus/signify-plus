const bcrypt = require('bcrypt');
class Encrypt {
    constructor(saltround) {
        this.saltround = saltround;
    }

    async encrypt(keyToEncrypt) {
        const hashedValue = await bcrypt.hash(keyToEncrypt, this.saltround);
        return hashedValue;
    }
}

module.exports = Encrypt;