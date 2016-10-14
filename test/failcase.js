var Assert = require('assert');
var csrfimmunity = require('../index').setKeyForEncryption("password123");
var options = {};

describe(__filename, function() {

    before(function(next) {
        options.formname = 'loginform';
        options.actionurl = 'http://www.weekendsecurity.org/login';
        options = JSON.stringify(options);
        next();
    });

    it('should match with the CSRF token with timestamp without options', function(next) {
        csrfimmunity.generateTimeBasedToken(null, function(token) {
            var result = csrfimmunity.verifyTimeBasedToken(token, null);
            Assert.equal(result, true);
            next();
        });
    });

    it('should match with the CSRF token without timestamp and options', function(next) {
        csrfimmunity.generateToken(null, function(token) {
            var result = csrfimmunity.verifyToken(token, null);
            Assert.equal(result, true);
            next();
        });
    });

    it('Blank csrftoken should return false for non-timestamp', function(next) {
        csrfimmunity.generateToken(null, function(token) {
            var result = csrfimmunity.verifyToken('', null);
            Assert.equal(result, false);
            next();
        });
    });

    it('Blank csrftoken should return false for timestamp', function(next) {
        csrfimmunity.generateTimeBasedToken(null, function(token) {
            var result = csrfimmunity.verifyTimeBasedToken('', null);
            Assert.equal(result, false);
            next();
        });
    });

    it('Should return false when options is not a valid JSON for time based token', function(next) {
        try {
            csrfimmunity.generateTimeBasedToken('test', function(token) {
                var result = csrfimmunity.verifyTimeBasedToken('test', null);
                next();
            });
        } catch (e) {
            Assert.equal(e.toString(), 'Error: Options is not a JSON String');
            next();
        }
    });

    it('Should return false when options is not a valid JSON for non time based token', function(next) {
        try {
            csrfimmunity.generateToken('test', function(token) {
                var result = csrfimmunity.verifyToken('test', null);
                next();
            });
        } catch (e) {
            Assert.equal(e.toString(), 'Error: Options is not a JSON String');
            next();
        }
    });

    it('Should return null if encryption key is blannk or null', function(next) {
        var csrf = require('../index').setKeyForEncryption('');
        Assert.equal(csrf, null);
        next();
    });

    it('Should return false when options is not a valid JSON for non time based token verify function', function(next) {

        csrfimmunity.generateToken(options, function(token) {
            try {
                var result = csrfimmunity.verifyToken(token, 'testing');
                next();
            } catch (e) {
                Assert.equal(e.toString(), 'Error: Options is not a JSON String');
                next();
            }
        });
    });

    it('Should return false when options is not a valid JSON for time based token verify function', function(next) {

        csrfimmunity.generateTimeBasedToken(options, function(token) {
            try {
                var result = csrfimmunity.verifyTimeBasedToken(token, 'testing');
                next();
            } catch (e) {
                Assert.equal(e.toString(), 'Error: Options is not a JSON String');
                next();
            }
        });
    });
});
