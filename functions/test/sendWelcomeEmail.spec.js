const assert = require('assert');
const funcs = require('../index');

describe('Sending welcome email', async function() {

    it('will send a welcome email', async function(done) {
        const req = {
            email: 'gregbruins@gmail.com'
        };

        // const res = {
        //     // send: function(resposne) {
        //     //     response.then((body) => {
        //     //         assert(body > 0);
        //     //         console.log(body);
        //     //         done();
        //     //     });
        //     // }
        // };

        const res = function(body) {
            console.log("BODY", body);
            done();
        }

        // funcs.sendWelcomeEmail(req, res);
        funcs.sendWelcomeEmail(req, res);
    });

});