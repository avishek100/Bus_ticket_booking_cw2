// utils/sendEmail.js
const nodemailer = require('nodemailer');

module.exports = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS  // your Gmail app password or normal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {

        throw new Error('Error sending email');
    }
};