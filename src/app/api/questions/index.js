import dbConnect from "../../../utils/dbConnect";
import Question from "../../../models/Question";
import Assignment from "../../../models/Assignment";
import { s3, bucketName } from "../../../config/s3";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const { assignmentId } = req.query;
    const assignment = await Assignment.findById(assignmentId).populate(
      "questions"
    );
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    const questions = assignment.questions.map((question) => {
      if (question.type === "Match") {
        question.options.forEach((option) => {
          if (option.columnA && option.columnA.startsWith("https://")) {
            const columnAKey = option.columnA.split(".com/")[1];
            option.columnA = `https://yourdomain.com/api/files/getFile?key=${columnAKey}`;
          }
          if (option.columnB && option.columnB.startsWith("https://")) {
            const columnBKey = option.columnB.split(".com/")[1];
            option.columnB = `https://yourdomain.com/api/files/getFile?key=${columnBKey}`;
          }
        });
      }
      return question;
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
}
