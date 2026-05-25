const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MEETING_EMAIL,
        pass: process.env.MEETING_EMAIL_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.MEETING_EMAIL,
            to,
            subject,
            html,
        });

        console.log("Email sent to:", to);
    } catch (error) {
        console.error("Email error:", error);
    }
};

module.exports = sendEmail;