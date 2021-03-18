# CSRFImmunity

[![Greenkeeper badge](https://badges.greenkeeper.io/ppattanayak/CSRFImmunity.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/ppattanayak/CSRFImmunity.png?branch=master)](https://travis-ci.org/ppattanayak/CSRFImmunity)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/ppattanayak/CSRFImmunity.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ppattanayak/CSRFImmunity/alerts/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/ppattanayak/CSRFImmunity.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ppattanayak/CSRFImmunity/alerts/)

## Description

CSRFImmunity is a NODE JS module to prevent Cross Site Request Forgery issue in web applications. This module can be used to generate and validate CSRF tokens. It can also be used to generate token based on various user defined parameters like page name, form action, userid or username and any other parameters the application needs. The module also uses a JSON string to generate the CSRF token which is the most important part of this module, it makes sure that the token is random enough for an user and a page. The application developer needs to make sure that the parameter in the JSON argument is unique for each user and each page.

## How to use

The module requires one encryption key to encrypt the CSRF token. This key need be passed to the module while initiating it in your code. Please make sure that the key is random not predictable and big in length.

```
var csrfi = require(csrfimmunity).setKeyForEncryption("encryption_key");
```

The setKeyForEncryption function makes sure that different application uses different and personal secret keys.

## Methods Available

### generateToken(options)

The above method accepts a JSON object as an argument. The JSON object is then used to generate the CSRF tokens. You can pass anything you need in this JSON object to make the CSRF token specific to certain page, form and user. An example of the options parameter is :

```
var options = '{"pagename":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

csrfi.generateToken(options, function(csrftoken){
    // Work with the token here
});
```

Please use a minimum of two parameter in the JSON argument which should be unique as per the user and per page. In the above example the "pagename" parameter is unique to the web page and the "username" parameter is unique to current logged in user.

### generateTimeBasedToken(options)

This method also accepts the exact same JSON parameter, but generates a time based CSRF token, which means this token will also have the timestamp when it is created. You can use this method to generate time based CSRF tokens and then use the varifyTimeBasedToken to validate this CSRF token.

```
var options = '{"pagename":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

csrfi.generateTimeBasedToken(options, function(csrftoken){
    // Work with the token here
});
```

The CSRF Token will somewhat look like :

*30466274c8c59179efffe210d72f9802aafa73a7f4462eed2781b9f80d42c9937d9687320f1cc5e7e1d1112a757bc0013a97166d663bb9ded09f0379e257988b77b6f32bc3c089a3a4b77c3050ec0d09fb74e77714bc468eea34dcadac1a4e4776c719d27c8416aa160e6d3bb6fb1af6dcd4b38b7c608cdce3e44b3158a2*

This token can directly be used by as a hidden parameter in the HTML form parameter.

### verifyToken(csrfToken, options)

This method is used to verify the CSRF token from the page. It accepts two parameters, the csrf token and the JSON object with the same key and value pair used during the generateToken function. Sending a different JSON string as argument will fail the check and will return false.

#### Example

```
var options = '{"pagename":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

var status = csrfi.verifyToken(csrfToken, options); (This will return boolean);
```

### verifyTimeBasedToken(formToken, cookieToken, options)

This method is used to verify time based CSRF tokens. You need to have add an extra key value pair in the JSON object as *"milliseconds"* and assign its value in milliseconds. This will validate the token age based on the time provided. If you do not pass the milliseconds key, then the function will choose the default time which is 250000 milliseconds.

#### Example

```
var options = '{"pagename":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak"}';

csrfi.generateTimeBasedToken(options, function(csrftoken){
    // Get the CSRF Token
});

var optionsForVerification = var options = '{"pagename":"login","formaction":"https:\/\/www.weekendsecurity.org", "username":"piyushpattanayak","milliseconds":"300000"}';

var status = csrfi.verifyTimeBasedToken(csrfToken, optionsForVerification); (This will return boolean)
```

## An overall example for this module

```
var csrf = require('../csrfimmunity').setKeyForEncryption("cdshcjkbdsckdslkclkncd");

var options = '{"pagename":"login", "username":"piyushpattanayak"}';

csrf.generateTimeBasedToken(options, function(timeBasedToken){
    console.log(timeBasedToken); // This will print the time based token
});

csrf.generateToken(options, function(plainToken){
    console.log(plainToken); // This will print usual token
});


var optionsNew = '{"pagename":"login", "username":"piyushpattanayak", "milliseconds":"3000000"}';

var statusTimeBased = csrf.verifyTimeBasedToken(timeBasedToken, optionsNew);
console.log(statusTimeBased); // This will print the boolean success or failure

var statusPlainToken = csrf.verifyToken(plainToken, options);
console.log(statusPlainToken); // This will print the boolean success or failure
```


## Author

- **Name:** Piyush Pattanayak
- **Email :** pattanayak.piyush@gmail.com
