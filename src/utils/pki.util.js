const crypto = require('crypto')

function generateKeyPair(){
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
    });

    return keyPair
}

module.exports = {
    generateKeyPair
}