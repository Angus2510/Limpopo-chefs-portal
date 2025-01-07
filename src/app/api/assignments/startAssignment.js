import dbConnect from "../../../utils/dbConnect";
import Assignment from "../../../models/Assignment";
import Student from "../../../models/Student";
import AssignmentResult from "../../../models/AssignmentResults";
import Answer from "../../../models/Answer";

export default async function handler(req, res) {
  await dbConnect();

  const { studentId, assignmentId } = req.query;
  const { password } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId).populate(
      "questions outcome"
    );

    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    const currentTime = new Date();
    const availableFrom = new Date(assignment.availableFrom);
    const availableUntil = new Date(
      availableFrom.getTime() + assignment.duration * 60000
    );

    if (currentTime < availableFrom || currentTime > availableUntil)
      return res
        .status(403)
        .json({ msg: "Test is not available at this time" });

    if (assignment.password !== password)
      return res.status(401).json({ msg: "Incorrect password" });

    let existingResult = await AssignmentResult.findOne({
      student: studentId,
      assignment: assignmentId,
    });

    if (!existingResult) {
      const student = await Student.findById(studentId).populate(
        "campus intakeGroup"
      );
      if (!student) return res.status(404).json({ msg: "Student not found" });

      existingResult = new AssignmentResult({
        assignment: assignmentId,
        student: studentId,
        campus: student.campus.length > 0 ? student.campus[0]._id : null,
        intakeGroup:
          student.intakeGroup.length > 0 ? student.intakeGroup[0]._id : null,
        outcome:
          assignment.outcome.length > 0 ? assignment.outcome[0]._id : null,
      });

      await existingResult.save();

      const answers = await Promise.all(
        assignment.questions.map((question) =>
          new Answer({
            student: studentId,
            assignment: assignmentId,
            question: question._id,
          }).save()
        )
      );

      existingResult.answers = answers.map((answer) => answer._id);
      await existingResult.save();
    }

    res.status(200).json({
      msg: "Access granted",
      assignment: {
        _id: assignment._id,
        title: assignment.title,
        duration: assignment.duration,
        availableFrom: assignment.availableFrom,
        availableUntil,
      },
      assignmentResultId: existingResult._id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
