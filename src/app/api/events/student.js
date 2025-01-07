import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import Event from "../../../models/Event";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const { studentId } = req.query;

    // Find the student by ID
    const student = await Student.findById(studentId)
      .populate("campus intakeGroup")
      .exec();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Extract the student's campuses and intake groups
    const studentCampuses = student.campus.map((campus) => campus._id);
    const studentIntakeGroups = student.intakeGroup.map(
      (intakeGroup) => intakeGroup._id
    );

    // Find events that match the student's campuses and intake groups
    const events = await Event.find({
      $or: [
        { campus: { $in: studentCampuses } },
        { intakeGroup: { $in: studentIntakeGroups } },
      ],
    }).exec();

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ error: "Error fetching student events" });
  }
});

export default handler;
