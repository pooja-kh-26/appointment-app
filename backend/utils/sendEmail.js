const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.MEETING_EMAIL,
        pass: process.env.MEETING_EMAIL_PASSWORD,
    },

    family: 4, // force IPv4

    tls: {
        rejectUnauthorized: false,
    },

    dnsTimeout: 10000,
    connectionTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MEETING_EMAIL,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Email error:", error);
    }
};

module.exports = sendEmail;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.MEETING_EMAIL,
//         pass: process.env.MEETING_EMAIL_PASSWORD,
//     },
// });

// const sendEmail = async (to, subject, html) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.MEETING_EMAIL,
//             to,
//             subject,
//             html,
//         });

//         console.log("Email sent to:", to);
//     } catch (error) {
//         console.error("Email error:", error);
//     }
// };

// module.exports = sendEmail;