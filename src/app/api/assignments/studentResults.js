import dbConnect from "../../../utils/dbConnect";
import AssignmentResult from "../../../models/AssignmentResults";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  const { studentId } = req.query;

  try {
    const assignmentResults = await AssignmentResult.find({
      student: studentId,
    })
      .populate({
        path: "assignment",
        select: "title availableFrom",
        populate: {
          path: "lecturer",
          model: "Staff",
          select: "profile.firstName profile.lastName",
        },
      })
      .select("assignment dateTaken status feedback");

    if (!assignmentResults.length) {
      return res
        .status(404)
        .json({ message: "No assignment results found for this student" });
    }

    res.status(200).json(assignmentResults);
  } catch (error) {
    console.error("Error fetching assignment results:", error);
    res.status(500).json({ error: "Error fetching assignment results" });
  }
});

export default handler;
