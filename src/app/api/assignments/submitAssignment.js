import dbConnect from "../../../utils/dbConnect";
import AssignmentResult from "../../../models/AssignmentResults";
import Answer from "../../../models/Answer";
import Question from "../../../models/Question";

const calculateScore = (question, ans) => {
  let score = 0;
  if (
    question.type === "SingleWord" &&
    ans.answer.toLowerCase() === question.correctAnswer.toLowerCase()
  ) {
    score = parseInt(question.mark);
  } else if (
    question.type === "TrueFalse" &&
    ans.answer === question.correctAnswer
  ) {
    score = parseInt(question.mark);
  } else if (
    question.type === "MultipleChoice" &&
    ans.answer.value === question.correctAnswer[0]
  ) {
    score = parseInt(question.mark);
  } else if (question.type === "Match") {
    const correctMatches = question.correctAnswer;
    let correctCount = 0;
    if (Array.isArray(ans.matchAnswers)) {
      for (let i = 0; i < ans.matchAnswers.length; i++) {
        if (
          ans.matchAnswers[i] &&
          ans.matchAnswers[i].pairOne === correctMatches[i].columnA &&
          ans.matchAnswers[i].pairTwo === correctMatches[i].columnB
        ) {
          correctCount++;
        }
      }
    }
    const markPerMatch = parseInt(question.mark) / correctMatches.length;
    score = Math.round(correctCount * markPerMatch);
  }
  return score;
};

export default async function handler(req, res) {
  await dbConnect();

  const { studentId, assignmentId } = req.query;
  const { answers } = req.body;

  try {
    const assignmentResult = await AssignmentResult.findOne({
      student: studentId,
      assignment: assignmentId,
    });

    if (!assignmentResult)
      return res.status(404).json({ msg: "Assignment result not found" });

    let totalScore = 0;

    for (const ans of answers) {
      let existingAnswer = await Answer.findOne({
        student: studentId,
        assignment: assignmentId,
        question: ans.questionId,
      });
      const question = await Question.findById(ans.questionId);
      if (!question) continue;

      const score = calculateScore(question, ans);
      totalScore += score;

      if (existingAnswer) {
        existingAnswer.answer = ans.answer;
        existingAnswer.matchAnswers = ans.matchAnswers;
        existingAnswer.scores = score;
        await existingAnswer.save();
      } else {
        existingAnswer = new Answer({
          student: studentId,
          assignment: assignmentId,
          question: ans.questionId,
          answer: ans.answer,
          matchAnswers: ans.matchAnswers,
          scores: score,
        });
        await existingAnswer.save();
        assignmentResult.answers.push(existingAnswer._id);
      }
    }

    assignmentResult.status = "Pending";
    assignmentResult.scores = totalScore;
    await assignmentResult.save();

    res
      .status(200)
      .json({
        msg: "Assignment submitted successfully",
        resultId: assignmentResult._id,
        totalScore,
      });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
