var colors = require('colors/safe');
var randomstring = require("randomstring"),
    encryptDecrypt = require("./lib/encrypt-decrypt"),
    separator = "###",
    defaultTimeDiff = 250000;

function isJsonString(str) {
    try {
        var js = JSON.parse(str);
        if (Object.keys(js).length < 2) {
            console.warn(colors.red("CSRFImmunity Module (csrfImmunity.js) : Options parameter is not enough. Application might be risky to CSRF attacks"));
        }
    } catch (e) {
        console.log(e);
        console.log(colors.red("CSRFImmunity Module (csrfImmunity.js) : Not a valid JSON string, " + str));
        // throw new Error(e);
        return false;
    }
    return true;
}

module.exports = {

    setKeyForEncryption: function(key) {
        if (key !== "" && key !== null) {
            encryptDecrypt.setKeyForEncryption(key);
            return this;
        } else {
            console.log(colors.red("Key not found. Please provide the encryption key"));
            return null;
        }
    },

    generateTimeBasedToken: function(options, callback) {

        //options needed to generate the csrf token Ex : {"formname":"loginform", formaction="http://www.weekendsecurity.org/submit"}
        options = options || '{"null": "null"}';

        //Check for valid JSON string
        if(isJsonString(options)){
            //Time calculated to check the CSRF token validity
            var milliseconds = new Date().getTime();

            //A random String to pass in the CSRF token and cookie value
            var randomString = randomstring.generate(15);

            //Converting the options JSON to hexadecimal value
            var optionsBuffer = new Buffer(options);
            var encodedOptions = optionsBuffer.toString('hex');

            //Collecting all the token parameters for token generations
            var tokenHidden = encodedOptions + separator + randomString + separator + milliseconds;

            // Encrypting the CSRF token
            var token = encryptDecrypt.encrypt(tokenHidden);

            callback(token);
        }else{
            throw new Error('Options is not a JSON String');
        }
    },

    generateToken: function(options, callback) {
        options = options || '{"null": "null"}';

        //Check for valid JSON string
        if(isJsonString(options)){
            //Time calculated to check the CSRF token validity
            var milliseconds = new Date().getTime();

            //A random String to pass in the CSRF token and cookie value
            var randomString = randomstring.generate(15);

            //Converting the options JSON to hexadecimal value
            var optionsBuffer = new Buffer(options);
            var encodedOptions = optionsBuffer.toString('hex');

            //Collecting all the token parameters for token generations
            var tokenHidden = encodedOptions + separator + randomString;

            // Encrypting the CSRF token
            var token = encryptDecrypt.encrypt(tokenHidden);

            callback(token);
        }else{
            throw new Error('Options is not a JSON String');
        }
    },

    verifyTimeBasedToken: function(csrfToken, options) {

        //The options which is used to generate the CSRF token
        options = options || '{"null":"null"}';

        //Check for valid JSON string
        if(isJsonString(options)){
            //Need the CSRF token to be passed here for verification
            csrfToken = csrfToken || "";

            //Return false if the csrfToken and cookieValue are sent null
            if (csrfToken === "") {
                return false;
            }

            //Decrypting the csrf token
            try {
                var decTokenHidden = encryptDecrypt.decrypt(csrfToken);

                //Split the tokens using the separators and store it in an array
                var decTokenHiddenArray = decTokenHidden.split(separator);

                //Converting the options in the hidden token to ascii and then into Javascript object
                var optionsBuffer = new Buffer(decTokenHiddenArray[0], 'hex');
                var optionsjsFromToken = JSON.parse(optionsBuffer.toString('ascii'));
                var optionsjsFromParam = JSON.parse(options);

                //Fetching the time limit of token validity from options parameter.
                var timeDef = optionsjsFromParam.milliseconds || defaultTimeDiff;

                var currentMilliseconds = new Date().getTime();

                //Verifying if the CSRF token with time, and options parameter
                if (currentMilliseconds < Number(decTokenHiddenArray[2]) + timeDef) {
                    for (var key in optionsjsFromToken) {
                        if (optionsjsFromToken[key] !== optionsjsFromParam[key]) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.log(colors.red(e));
                console.log(colors.red("CSRFImmunity (index.js) : CSRF decryption failed.", e));
                throw new Error(e);
            }
        }else{
            throw new Error('Options is not a JSON String');
        }
    },

    verifyToken: function(csrfToken, options) {

        //The options which is used to generate the CSRF token
        options = options || '{"null":"null"}';

        if(isJsonString(options)){
            //Need the CSRF token to be passed here for verification
            csrfToken = csrfToken || "";

            //Return false if the csrfToken and cookieValue are sent null
            if (csrfToken === "") {
                return false;
            }

            //Decrypting the csrf token
            try {
                var decTokenHidden = encryptDecrypt.decrypt(csrfToken);
                //Split the tokens using the separators and store it in an array
                var decTokenHiddenArray = decTokenHidden.split(separator);

                //Converting the options in the hidden token to ascii and then into Javascript object
                var optionsBuffer = new Buffer(decTokenHiddenArray[0], 'hex');
                var optionsjsFromToken = JSON.parse(optionsBuffer.toString('ascii'));
                var optionsjsFromParam = JSON.parse(options);

                //Verifying if the CSRF token with time, and options parameter
                for (var key in optionsjsFromToken) {
                    if (optionsjsFromToken[key] !== optionsjsFromParam[key]) {

                        return false;
                    }
                }

                return true;
            } catch (e) {
                console.log(e);
                console.log(colors.red("CSRFImmunity (csrfImmunity.js) : CSRF decryption failed."));
                throw new Error(e);
            }
        }else{
            throw new Error('Options is not a JSON String');
        }
    }

};
