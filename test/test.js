var Assert = require('assert');
var csrfimmunity = require('../index').setKeyForEncryption("password123");
var options = {};

describe(__filename, function() {

    before(function(next) {
        // process.chdir(__dirname + '/test/app');
        options.formname = 'loginform';
        options.actionurl = 'http://www.weekendsecurity.org/login';
        options = JSON.stringify(options);
        next();
    });

    it('should match with the CSRF token with timestamp', function(next){
        csrfimmunity.generateTimeBasedToken(options, function(token){
            var result = csrfimmunity.verifyTimeBasedToken(token, options);
            Assert.equal(result, true);
            next();
        });
    });

    it('should match with the CSRF token without timestamp', function(next){
        csrfimmunity.generateToken(options, function(token){
            var result = csrfimmunity.verifyToken(token, options);
            Assert.equal(result, true);
            next();
        });
    });

    it('should fail the CSRF token check after time expires', function(done){
        var newoptions = JSON.parse(options);
        newoptions.milliseconds = 1;

            csrfimmunity.generateTimeBasedToken(options, function(token){
                setTimeout(function(){
                    var result = csrfimmunity.verifyTimeBasedToken(token, JSON.stringify(newoptions));
                    Assert.equal(result, false);
                    done();
                }, 3000);
            });
    });
});
