import AssignmentResult from "../../../models/AssignmentResult";

export default async function handler(req, res) {
  const { resultId } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const assignmentResult = await AssignmentResult.findById(resultId)
          .populate("student")
          .populate("answers")
          .populate("intakeGroup")
          .populate("campus")
          .populate("markedBy");

        if (!assignmentResult) {
          return res.status(404).json({ msg: "Assignment result not found" });
        }

        res.status(200).json(assignmentResult);
      } catch (err) {
        console.error("Error fetching assignment result:", err);
        res.status(500).json({ error: "Failed to fetch assignment result" });
      }
      break;

    case "DELETE":
      try {
        const deletedResult = await AssignmentResult.findByIdAndDelete(
          resultId
        );
        if (!deletedResult) {
          return res.status(404).json({ msg: "Assignment result not found" });
        }

        res.status(200).json({ msg: "Assignment result deleted" });
      } catch (err) {
        console.error("Error deleting assignment result:", err);
        res.status(500).json({ error: "Failed to delete assignment result" });
      }
      break;

    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
