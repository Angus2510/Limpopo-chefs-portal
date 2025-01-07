import dbConnect from "../../../utils/dbConnect";
import Assignment from "../../../models/Assignment";
import AssignmentResult from "../../../models/AssignmentResults";
import Answer from "../../../models/Answer";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default async function handler(req, res) {
  await dbConnect();

  const { studentId, assignmentId } = req.query;

  try {
    const assignmentResult = await AssignmentResult.findOne({
      student: studentId,
      assignment: assignmentId,
    });

    if (!assignmentResult)
      return res.status(404).json({ msg: "Assignment result not found" });

    if (assignmentResult.status !== "Starting")
      return res.status(403).json({ msg: "Assignment is already started." });

    assignmentResult.status = "Writing";
    await assignmentResult.save();

    const assignment = await Assignment.findById(assignmentId).populate(
      "questions"
    );

    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    const shuffledQuestions = shuffleArray(assignment.questions);

    const answers = await Answer.find({
      student: studentId,
      assignment: assignmentId,
    });

    const questionsWithAnswers = shuffledQuestions.map((question) => {
      if (question.type === "Match") {
        question.options.forEach((option) => {
          if (option.columnA && option.columnA.startsWith("https://")) {
            const columnAKey = option.columnA.split(".com/")[1];
            option.columnA = `https://limpopochefs.vercel.app/api/files/getFile?key=${columnAKey}`;
          }
          if (option.columnB && option.columnB.startsWith("https://")) {
            const columnBKey = option.columnB.split(".com/")[1];
            option.columnB = `https://limpopochefs.vercel.app/api/files/getFile?key=${columnBKey}`;
          }
        });
      }

      const answer = answers.find(
        (ans) => ans.question.toString() === question._id.toString()
      );
      const questionObject = question.toObject();
      delete questionObject.correctAnswer;
      return {
        ...questionObject,
        answer: answer ? answer.answer : null,
        matchAnswers: answer ? answer.matchAnswers : [],
      };
    });

    res.status(200).json({
      msg: "Assignment status changed to Writing",
      resultId: assignmentResult._id,
      questions: questionsWithAnswers,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
