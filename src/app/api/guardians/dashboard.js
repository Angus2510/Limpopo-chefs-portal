import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import Event from "../../../models/Event";
import Attendance from "../../../models/Attendance";
import Guardian from "../../../models/Guardian";
import AssignmentResult from "../../../models/AssignmentResults";
import Finance from "../../../models/Finance";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const { guardianId } = req.query;

    // Find all students associated with the guardian
    const students = await Student.find({ guardians: guardianId })
      .populate("campus intakeGroup")
      .exec();

    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No students found for this guardian" });
    }

    // Additional logic to fetch events, attendance, assignment results, and finance data can be added here

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
}
