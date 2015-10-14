# CSRFImmunity

## Description

CSRFImmunity is a NODE JS module to prevent Cross Site Request Forgery issue in web applications. This module can be used to generate and validate CSRF tokens. This module can be used to generate token based on various user defined parameters like form name, form action, userid or username and anything other parameters the application needs. This module generates two tokens separated by ###. The first part can be used as a hidden parameter in any form and the second part is used to store in the client cookie. Both of this parts are needed separately in the server to validate the request.

## How to use

The module requires two encryption keys to encrypt the csrf token in the form parameter and in the cookie. The keys need be passed to the module while initiating it in your code.

```
var csrfi = require(csrfimmunity).setKeyForEncryption("key1_for_form_parameter", "key2_for_form_data");
```

The setKeyForEncryption method makes sure that applications uses different and their personal secret keys. You can use one key in both the places, but it is always advised to use two different strong keys.

## Methods Available

### generateToken(options)

The above method accepts a JSON object as an argument. The JSON object is then used to generate the CSRF tokens. You can pass anything you need in this JSON object to make the CSRF token specific to certain page, form and user. An example of the options parameter is :

```
var options = '{"formname":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}'

var csrfTokens = csrfi.generateToken(options);
```

You can always keep the form blank if you want the token to generated only based on random strings, but this will make you tokens more generic.

### generateTimeBasedToken(options)

This method also accepts the exact same JSON parameter, but generates a time based CSRF token. You can use this method to generate time based CSRF tokens and then use the varifyTimeBasedToken to validate this CSRF token.

```
var options = '{"formname":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}'

var csrfTokens = csrfi.generateTimeBasedToken(options);
```

The csrfTokine will somewhat look like :

*30466274c8c59179efffe210d72f9802aafa73a7f4462eed2781b9f80d42c9937d9687320f1cc5e7e1d1112a757bc0013a97166d663bb9ded09f0379e257988b77b6f32bc3c089a3a4b77c3050ec0d09fb74e77714bc468eea34dcadac1a4e3a51c13ab46bae4bf55d34683caaca1af6dcd4b38b7d6789d3ece941325eaf*###*12fbdff9398f4b625549fc11dca6535c9d7156ccaedcaffde816a811cfa61950b887a02e400cfb4b8bbe3dde*

The first part of the token is for the form parameter and the second part of the toke is for the cookie value.

### verifyToken(formToken, cookieToken, options)

This method is used to verify the CSRF token from the page. It accepts three parameters, the csrf token from the hidden form parameter, the token from the cookie and the JSON object with the same key and value used in the generateToken function.

#### Example

```
var options = '{"formname":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

var status = csrfi.verifyToken(formToken, cookieToken, options); (This will return boolean);
```

### verifyTimeBasedToken(formToken, cookieToken, options)

This method is used to verify time based CSRF tokens. You have add a extra key value pair in the JSON object as *"milliseconds"* and assign its value in milliseconds. This will verify that the token is not old than the the time specified. If you do not pass the milliseconds key, then the function will choose the default which is 250000 milliseconds.

#### Example

```
var options = '{"formname":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

var csrfTokens = csrfi.generateToken(options);

var optionsForVerification = '{"formname":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak", "milliseconds":"300000"}';

var status = csrfi.verifyToken(formToken, cookieToken, optionsForVerification); (This will return boolean)
```

## An overall example for this module

```
var csrf = require('../csrfImmunity').setKeyForEncryption("cdshcjkbdsckdslkclkncd", "cdsbgVDGHJACAJGH");

var options = '{"user":"Piyush Pattanayak", "formname":"loginform"}';

var timeBasedToken = csrf.generateTimeBasedToken(options);
console.log(timeBasedToken); // This will print the time based token

var plainToken = csrf.generateToken(options);
console.log(plainToken); // This will print usual token

var timeBasedTokenArray = timeBasedToken.split("###");
var plainTokenArray = plainToken.split("###");

var optionsNew = '{"name":"Piyush Pattanayak","company":"eBay", "milliseconds":"3000000"}';
var statusTimeBased = csrf.verifyTimeBasedToken(timeBasedTokenArray[0], timeBasedTokenArray[1], optionsNew);
console.log(statusTimeBased); // This will print the boolean success or failure

var statusPlainToken = csrf.verifyToken(plainTokenArray[0], plainTokenArray[1], optionsNew);
console.log(statusPlainToken); // This will print the boolean success or failure**
```


## Author

**Name:** Piyush Pattanayak
**Email :** pattanayak.piyush@gmail.com
