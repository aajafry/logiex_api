"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: {
            name: "LogiEx",
            address: process.env.EMAIL_ADDRESS,
        },
        to,
        subject,
        text,
    };
    try {
        const response = await nodemailer_1.transporter.sendMail(mailOptions);
        console.log("Email sent:", response.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
exports.sendEmail = sendEmail;
