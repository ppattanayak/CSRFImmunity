var randomstring = require("randomstring"),
    encryptDecrypt = require("./lib/encrypt-decrypt"),
    separator = "###",
    defaultTimeDiff = 250000,
    HIDDEN_FORM = 1,
    COOKIE_TOKEN = 2;


function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
      console.log(e);
      console.log("CSRFImmunity Module (csrfImmunity.js) : Not a valid JSON string, " + str);
      process.exit(1);
    }
    return true;
}

module.exports = {

    setKeyForEncryption: function(keyForm, keyCookie){
      if(keyForm !== "" && keyCookie !== "" && keyForm !== null && keyCookie !== null){
        encryptDecrypt.setKeyForEncryption(keyForm, keyCookie);
        return this;
      }else{
        console.log("Key not found. Please provide two encryption keys");
        return null;
      }
    },

    generateTimeBasedToken: function(options){

      //options needed to generate the csrf token Ex : {"formname":"loginform", formaction="http://www.weekendsecurity.org/submit"}
      options = options || {"null":"null"};

      isJsonString(options);
      //console.log(formaction);

      //Time calculated to check the CSRF token validity
      var milliseconds = (new Date).getTime();

      //A random String to pass in the CSRF token and cookie value
      var randomString = randomstring.generate(15);

      //A additional random String to pass in the cookie
      var randomStringCookie = randomstring.generate(10);

      //Converting the options JSON to hexadecimal value
      var optionsBuffer = new Buffer(options);
      var encodedOptions = optionsBuffer.toString('hex');

      //Collecting all the token parameters for token generations
      var tokenHidden = encodedOptions + separator + randomString + separator + milliseconds;
      var tokenCookie = randomString + separator + milliseconds + separator + randomStringCookie;

      // Encrypting both the hidden and cookie token
      var encTokenHidden = encryptDecrypt.encrypt(tokenHidden, HIDDEN_FORM);
      var encTokenCookie = encryptDecrypt.encrypt(tokenCookie, COOKIE_TOKEN);

      // Final Token separated by ###. First part should be used in hidden field and the second in the cookie
      var token = encTokenHidden + separator + encTokenCookie;

      return token;  //encTokenHidden###encTokenCookie
    },

    generateToken: function(options){
      options = options || {"null":"null"};
      //console.log(formaction);

      isJsonString(options);

      //Time calculated to check the CSRF token validity
      var milliseconds = (new Date).getTime();

      //A random String to pass in the CSRF token and cookie value
      var randomString = randomstring.generate(15);

      //A additional random String to pass in the cookie
      var randomStringCookie = randomstring.generate(10);

      //Converting the options JSON to hexadecimal value
      var optionsBuffer = new Buffer(options);
      var encodedOptions = optionsBuffer.toString('hex');

      //Collecting all the token parameters for token generations
      var tokenHidden = encodedOptions + separator + randomString;
      var tokenCookie = randomString + separator + randomStringCookie;

      // Encrypting both the hidden and cookie token
      var encTokenHidden = encryptDecrypt.encrypt(tokenHidden, HIDDEN_FORM);
      var encTokenCookie = encryptDecrypt.encrypt(tokenCookie, COOKIE_TOKEN);

      // Final Token separated by ###. First part should be used in hidden field and the second in the cookie
      var token = encTokenHidden + separator + encTokenCookie;

      return token;  //encTokenHidden###encTokenCookie
    },

    verifyTimeBasedToken: function(csrfToken, cookieValue, options){

      //The options which is used to generate the CSRF token
      options = options || '{"null":"null"}';

      isJsonString(options);

      //Need the CSRF token to be passed here for verification
      csrfToken = csrfToken || "";

      //Need the CSRF cookie value to be check against the CSRF token
      cookieValue = cookieValue || "";

      //Return false if the csrfToken and cookieValue are sent null
      if(csrfToken === "" || cookieValue === ""){
        return false;
      }
      // console.log(csrfToken);
      // console.log(cookieValue);

      //Decrypting the hidden token and cookie
      try{
        var decTokenHidden = encryptDecrypt.decrypt(csrfToken, HIDDEN_FORM);
        var decTokenCookie = encryptDecrypt.decrypt(cookieValue, COOKIE_TOKEN);
      }catch (e) {
          console.log(e);
          console.log("CSRFImmunity (csrfImmunity.js) : CSRF decryption failed.");
          process.exit();
      }

      //Split the tokens using the separators and store it in an array
      var decTokenHiddenArray = decTokenHidden.split(separator);
      var decTokenCookieArray = decTokenCookie.split(separator);

      //Converting the options in the hidden token to ascii and then into Javascript object
      var optionsBuffer = new Buffer(decTokenHiddenArray[0], 'hex');
      var optionsjsFromToken = JSON.parse(optionsBuffer.toString('ascii'));
      var optionsjsFromParam = JSON.parse(options);

      //Fetching the time limit of token validity from options parameter.
      var timeDef = optionsjsFromParam.milliseconds || defaultTimeDiff;

      //Verifying if the token from hidden parameter is same as the token form the cookie
      try{
        if(decTokenHiddenArray[1] === decTokenCookieArray[0]){
          var currentMilliseconds = (new Date).getTime();
          // console.log(currentMilliseconds);
          // console.log(Number(decTokenCookieArray[1])+ Number(timeDef));
          if(currentMilliseconds < Number(decTokenCookieArray[1])+ timeDef){
              for (key in optionsjsFromToken) {
                  if(optionsjsFromToken[key] !== optionsjsFromParam[key]){
                    return false;
                  }
              }
              return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }catch (e){
        console.log(e);
        process.exit();
      }

    },

    verifyToken: function(csrfToken, cookieValue, options){

          //The options which is used to generate the CSRF token
          options = options || '{"null":"null"}';

          isJsonString(options);
        //  console.log(options);

          //Need the CSRF token to be passed here for verification
          csrfToken = csrfToken || "";

          //Need the CSRF cookie value to be check against the CSRF token
          cookieValue = cookieValue || "";

          //Return false if the csrfToken and cookieValue are sent null
          if(csrfToken === "" || cookieValue === ""){
        //    console.log(4);
            return false;
          }
          // console.log(csrfToken);
          // console.log(cookieValue);

          //Decrypting the hidden token and cookie
          try{
            var decTokenHidden = encryptDecrypt.decrypt(csrfToken, HIDDEN_FORM);
            var decTokenCookie = encryptDecrypt.decrypt(cookieValue, COOKIE_TOKEN);
          }catch (e) {
              console.log(e);
              console.log("CSRFImmunity (csrfImmunity.js) : CSRF decryption failed.");
              process.exit();
          }

          var decTokenHiddenArray = decTokenHidden.split(separator);
          var decTokenCookieArray = decTokenCookie.split(separator);

          var optionsBuffer = new Buffer(decTokenHiddenArray[0], 'hex');
          var optionsjsFromToken = JSON.parse(optionsBuffer.toString('ascii'));
          var optionsjsFromParam = JSON.parse(options);

          if(decTokenHiddenArray[1] === decTokenCookieArray[0]){

            for (key in optionsjsFromToken) {
                if(optionsjsFromToken[key] !== optionsjsFromParam[key]){
            //      console.log(1);
                  return false;
                }
            }
            return true;
          }else{
          //  console.log(3);
            return false;
          }
    }

}
