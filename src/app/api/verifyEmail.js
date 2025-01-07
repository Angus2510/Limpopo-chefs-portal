import dbConnect from "../../utils/dbConnect";
import Staff from "../../models/Staff";
import Guardian from "../../models/Guardian";
import Student from "../../models/Student";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  try {
    // Email verification logic...
    res.json({ message: "Email verification request received" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

export default handler;
