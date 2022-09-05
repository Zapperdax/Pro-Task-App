const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);;

const sendWelcomeEmail = (email, name)=> {
    sgMail.send({
        to: email,
        from: 'qa80986@gmail.com',
        subject: 'Thanks For Joining Our App',
        text: `Welcome To The App ${name}. Lets Create Tasks Together`
    })
}

const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'qa80986@gmail.com',
        subject: `Goodbye ${name}. Hope You Enjoyed Our Service`,
        text: `Thanks For Being An Amazing Member, Can You Take A Moment To Tell Us Why You Left`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}