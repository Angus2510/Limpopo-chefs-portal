import dbConnect from "../../../utils/dbConnect";
import AssignmentResult from "../../../models/AssignmentResults";
import Answer from "../../../models/Answer";

export default async function handler(req, res) {
  await dbConnect();

  const { studentId, assignmentId } = req.query;
  const { questionId, answer, matchAnswers } = req.body;

  try {
    const assignmentResult = await AssignmentResult.findOne({
      student: studentId,
      assignment: assignmentId,
    });

    if (!assignmentResult)
      return res.status(404).json({ msg: "Assignment result not found" });

    let existingAnswer = await Answer.findOne({
      student: studentId,
      assignment: assignmentId,
      question: questionId,
    });

    if (existingAnswer) {
      existingAnswer.answer = answer;
      existingAnswer.matchAnswers = matchAnswers;
      await existingAnswer.save();
    } else {
      existingAnswer = new Answer({
        student: studentId,
        assignment: assignmentId,
        question: questionId,
        answer,
        matchAnswers,
      });
      await existingAnswer.save();
      assignmentResult.answers.push(existingAnswer._id);
      await assignmentResult.save();
    }

    res
      .status(200)
      .json({
        msg: "Answer submitted successfully",
        answerId: existingAnswer._id,
      });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
