import dbConnect from "../../../utils/dbConnect";
import Staff from "../../../models/Staff";
import nodemailer from "nodemailer";
import nextConnect from "next-connect";

const handler = nextConnect();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

handler.post(async (req, res) => {
  await dbConnect();

  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newStaff = new Staff({
      name,
      email,
      role,
    });

    await newStaff.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Limpopo Chefs Academy",
      text: `Hello ${name},\n\nWelcome to Limpopo Chefs Academy! Your role is ${role}.\n\nBest regards,\nLimpopo Chefs Academy`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(201)
          .json({ message: "Staff added and email sent", newStaff });
      }
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ message: "Error adding staff" });
  }
});

export default handler;
