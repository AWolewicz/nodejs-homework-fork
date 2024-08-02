const nodemailer = require("nodemailer");
require('dotenv').config();

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: M_USER,
        pass: M_PASS,
    },
});

async function sendVerificationEmail(email, token) {
    const verificationLink = `www.www.pl/users/verify/${token}`;
    const options = await transporter.sendMail({
        from: '"Agnieszka" <mycompany@gmail.com>',
        to: email,
        subject: "Email Verification",
        text: "Please verify your email by clicking on the following link: ${verificationLink}",
        html: 'Please verify your email by clicking on the following link: <b> <a href="${verificationLink}">Verify Email</a></b> ',
    });
};

module.exports = sendVerificationEmail;