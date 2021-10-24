const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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