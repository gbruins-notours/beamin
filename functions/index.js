const functions = require('firebase-functions');


function getMailgun() {
    return require('mailgun-js')({
        apiKey: functions.config().mailgun.key,
        domain: functions.config().mailgun.domain
    });
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});


// exports.sendWelcomeEmail = functions.database.ref('users/{uid}').onWrite(event => {
exports.sendWelcomeEmail = functions.https.onRequest((request, response) => {
    console.log("REQUEST", request);

    let html = `
        <p>Thank you for registering for early access to gmnst.com!</p>
        <p>We're working hard to finish our web store and drop our first few products.</p>
        <p>We would love to hear from you, so feel free to contact us any time with your ideas, questions, or whatever!<p>
        <p>Email us at: info@gmnst.com</p>
    `;

    var data = {
        from: 'no-reply@gmnst.com',
        subject: 'Welcome to gmnst.com early access!',
        html: html,
        to: request.email
    }

    return new Promise((resolve, reject) => {
        getMailgun().messages().send(data, (error, body) => {
            if(error) {
                console.log(error);
                reject(error);
                return;
            }

            resolve(body);
        });
    })
    
    // return mailgun.messages().send(data);
});


exports.sendWelcomeNotificationToAdmin = functions.https.onRequest((request, response) => {
    console.log("REQUEST", request);

    let html = `
        <p>New signup for early access</p>
        <p>${ request.email }</p>
    `;

    var data = {
        from: 'no-reply@gmnst.com',
        subject: 'gmnst.com - new signup for early access',
        html: html,
        to: functions.config().admin.email
    }

    return new Promise((resolve, reject) => {
        getMailgun().messages().send(data, (error, body) => {
            if(error) {
                console.log(error);
                reject(error);
                return;
            }

            resolve(body);
        });
    })
    
    // return mailgun.messages().send(data);
})