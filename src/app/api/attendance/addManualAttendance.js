import dbConnect from "../../../utils/dbConnect";
import Attendance from "../../../models/Attendance";
import Student from "../../../models/Student";
import Campus from "../../../models/Campus";
import IntakeGroup from "../../../models/IntakeGroup";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const { intakeGroup, campus, attendanceDate, type, attendees } = req.body;

    const attendance = new Attendance({
      intakeGroup,
      campus,
      attendanceDate,
      type,
      attendees,
    });

    await attendance.save();

    res
      .status(201)
      .json({ message: "Attendance added successfully", attendance });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ error: "Error adding attendance" });
  }
}
