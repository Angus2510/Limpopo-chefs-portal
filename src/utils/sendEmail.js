import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Create transporter object using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Async function to send an email notification
const sendEmailNotification = async (email, title, message) => {
  const subject = title;

  // Path to email template
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "Notification.html"
  );

  try {
    // Read email template
    const html = await fs.promises.readFile(templatePath, "utf8");

    // Replace placeholders in the template
    const emailHtml = html
      .replace(/{{title}}/g, title)
      .replace("{{message}}", message);

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: emailHtml,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmailNotification;
