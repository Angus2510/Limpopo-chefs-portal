import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import Assignment from "../../../models/Assignment";

export default async function handler(req, res) {
  await dbConnect();

  const { studentId } = req.query;

  try {
    const student = await Student.findById(studentId).populate(
      "campus intakeGroup"
    );

    if (!student) return res.status(404).json({ msg: "Student not found" });

    const campusIds = student.campus.map((campus) => campus._id.toString());
    const intakeGroupIds = student.intakeGroup.map((intakeGroup) =>
      intakeGroup._id.toString()
    );

    const individualAssignments = await Assignment.find({
      individualStudents: studentId,
    })
      .select("title lecturer outcome availableFrom duration")
      .populate("lecturer", "profile.firstName")
      .populate("outcome", "title");

    const groupAssignments = await Assignment.find({
      campus: { $in: campusIds },
      intakeGroups: { $in: intakeGroupIds },
    })
      .select("title lecturer outcome availableFrom duration")
      .populate("lecturer", "profile.firstName")
      .populate("outcome", "title");

    const uniqueAssignments = [
      ...individualAssignments,
      ...groupAssignments,
    ].filter(
      (assignment, index, self) =>
        index ===
        self.findIndex((a) => a._id.toString() === assignment._id.toString())
    );

    const filteredAssignments = uniqueAssignments.map((assignment) => {
      const availableUntil = new Date(assignment.availableFrom);
      availableUntil.setMinutes(
        availableUntil.getMinutes() + assignment.duration
      );
      return {
        _id: assignment._id,
        title: assignment.title,
        lecturer: assignment.lecturer
          ? assignment.lecturer.profile.firstName
          : "N/A",
        outcome: assignment.outcome.length
          ? assignment.outcome.map((o) => o.title).join(", ")
          : "N/A",
        availableFrom: assignment.availableFrom,
        duration: assignment.duration,
        availableUntil,
      };
    });

    res.json(filteredAssignments);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
