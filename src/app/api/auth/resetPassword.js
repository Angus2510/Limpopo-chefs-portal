import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import { sendEmailNotification } from "../../../config/nodeMailerConn";
import crypto from "crypto";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  const { email } = req.body;

  // Check if the email exists
  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Generate a reset token and expiry time
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  // Save token and expiry to the student
  student.resetToken = resetToken;
  student.resetTokenExpiry = resetTokenExpiry;
  await student.save();

  // Send email notification
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmailNotification({
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
  });

  res.status(200).json({ message: "Password reset email sent" });
});

export default handler;
