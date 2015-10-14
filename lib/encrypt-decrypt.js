var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    keyForHiddenToken = '',
    keyForCookie = '',
    HIDDEN_FORM = 1,
    COOKIE_TOKEN = 2;


module.exports = {

    setKeyForEncryption: function(keyForm, keyCookie){
      keyForHiddenToken = keyForm;
      keyForCookie = keyCookie;
    },

    encrypt: function(text, mode){

      if(mode === HIDDEN_FORM){
        password = keyForHiddenToken;
      }else if(mode === COOKIE_TOKEN){
        password = keyForCookie;
      }
      if(password === ''){
        console.log("Key not provided for encryption");
        return null;
      }
      var cipher = crypto.createCipher(algorithm,password)
      var crypted = cipher.update(text,'utf8','hex')
      crypted += cipher.final('hex');
      return crypted;
    },

    decrypt: function(text, mode){

      if(mode === HIDDEN_FORM){
        password = keyForHiddenToken;
      }else if(mode === COOKIE_TOKEN){
        password = keyForCookie;
      }
      if(password === ''){
        console.log("Key not provided for decryption");
        return null;
      }
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }

}
