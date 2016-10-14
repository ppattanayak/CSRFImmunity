var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    encryptionKey = '';

var colors = require('colors/safe');

module.exports = {

    setKeyForEncryption: function(keyForm){
      encryptionKey = keyForm;
    },

    encrypt: function(text){
      password = encryptionKey;

      if(password === ''){
        console.log(colors.red("Key not provided for encryption"));
        return null;
      }
      var cipher = crypto.createCipher(algorithm,password);
      var crypted = cipher.update(text,'utf8','hex');
      crypted += cipher.final('hex');
      return crypted;
    },

    decrypt: function(text){
      password = encryptionKey;

      if(password === ''){
        console.log(colors.red("Key not provided for decryption"));
        return null;
      }
      var decipher = crypto.createDecipher(algorithm,password);
      var dec = decipher.update(text,'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
    }

};
