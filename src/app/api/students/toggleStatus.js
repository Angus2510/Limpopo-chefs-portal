import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.patch(async (req, res) => {
  await dbConnect();

  try {
    const studentId = req.query.id;
    const { reason } = req.body;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.active) {
      // Disabling the student, reason is required
      if (!reason) {
        return res
          .status(400)
          .json({ message: "Reason is required when disabling a student" });
      }
      student.active = false;
      student.disableReason = reason;
    } else {
      // Enabling the student
      student.active = true;
      student.disableReason = null;
    }

    await student.save();

    res
      .status(200)
      .json({ message: "Student status updated successfully", student });
  } catch (error) {
    console.error("Error toggling student status:", error);
    res.status(500).json({ message: "Error toggling student status" });
  }
});

export default handler;
