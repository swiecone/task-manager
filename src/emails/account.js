const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alex@alexswiec.com', 
        subject: 'Welcome to the task manager!',
        text: `Hope you enjoy the app, ${name}.  Let me know how you get along with the app`
    })
}

const sendByeByeEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'alex@alexswiec.com',
        subject: 'Bye Bye and thanks for trying the app',
        text: `Hope you enjoyed the app, ${name}.  Let us know your thoughts around the app`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendByeByeEmail,
}