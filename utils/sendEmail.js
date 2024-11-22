import { transporter } from "../config/nodemailer.js";

export const sendEmail = async (to, subject, text) => {
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
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
