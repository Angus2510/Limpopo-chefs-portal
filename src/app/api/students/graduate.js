import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const studentsToUpdate = req.body;

    if (!Array.isArray(studentsToUpdate) || studentsToUpdate.length === 0) {
      return res.status(400).json({ message: "No student data provided" });
    }

    const updatedStudents = await Promise.all(
      studentsToUpdate.map(async (student) => {
        if (!student.id) {
          throw new Error("Invalid student data");
        }

        const updatedStudent = await Student.findByIdAndUpdate(
          student.id,
          { graduated: true },
          { new: true }
        ).lean();

        return updatedStudent;
      })
    );

    res
      .status(200)
      .json({ message: "Students graduated successfully", updatedStudents });
  } catch (error) {
    console.error("Error graduating students:", error);
    res.status(500).json({ error: "Error graduating students" });
  }
}
