const assert = require('assert');
const funcs = require('../index');

describe('Sending email to admin', function() {

    it('will send an email to admin', async function(done) {
        const req = {
            email: 'gregbruins@gmail.com'
        };

        const res = {
            send: function(resposne) {
                response.then((body) => {
                    assert(body > 0);
                    console.log(body);
                    done();
                });
            }
        };

        funcs.sendWelcomeNotificationToAdmin(req, res);
    });

});