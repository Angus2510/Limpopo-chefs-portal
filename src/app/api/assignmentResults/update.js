import { PrismaClient } from "@prisma/client";
import { addNotification } from "../../../middleware/notificationMiddleware";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { resultId } = req.query;
  const { answers, staffId } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res
      .status(400)
      .json({ error: "Answers are required to update scores" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let totalScore = 0;
      let totalPossibleScore = 0;

      // Update each answer and calculate scores
      for (const answer of answers) {
        const { answerId, score } = answer;

        const updatedAnswer = await tx.answers.update({
          where: { id: answerId },
          data: { scores: score },
        });

        if (updatedAnswer) {
          const question = await tx.questions.findUnique({
            where: { id: updatedAnswer.question },
          });
          totalScore += score;
          totalPossibleScore += parseFloat(question.mark);
        }
      }

      // Check for zero total score
      if (totalPossibleScore === 0) {
        throw new Error(
          "Total possible score is zero, cannot calculate percentage."
        );
      }

      const percentage = Math.round((totalScore / totalPossibleScore) * 100);

      // Update assignment result with full population
      const updatedAssignmentResult = await tx.assignmentresults.update({
        where: { id: resultId },
        data: {
          scores: totalScore,
          percent: percentage,
          status: "Marked",
          markedBy: staffId,
        },
        include: {
          assignment: true,
          student: true,
          intakeGroup: true,
          campus: true,
        },
      });

      // Create notification with same format
      await tx.notifications.create({
        data: {
          title: "Test/Task Marked",
          message: `Your test/task "${updatedAssignmentResult.assignment.title}" has been marked.`,
          userId: updatedAssignmentResult.student.id,
          type: "notification",
          isRead: false,
          createdAt: new Date(),
          userType: updatedAssignmentResult.student.userType,
        },
      });

      return updatedAssignmentResult;
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating assignment result:", err);
    res.status(400).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
