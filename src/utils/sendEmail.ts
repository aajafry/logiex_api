import { transporter } from "../config/nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: {
      name: "LogiEx",
      address: process.env.EMAIL_ADDRESS as string,
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
