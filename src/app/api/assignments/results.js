import dbConnect from "../../../utils/dbConnect";
import AssignmentResult from "../../../models/AssignmentResults";
import Outcome from "../../../models/Outcome";
import Campus from "../../../models/Campus";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const intakeGroupId = req.query.id;
    const assignmentResults = await AssignmentResult.find({
      intakeGroup: intakeGroupId,
    })
      .populate("outcome")
      .populate("campus");

    const groupedResults = assignmentResults.reduce((acc, result) => {
      const campusId = result.campus._id.toString();
      const outcomeId = result.outcome._id.toString();

      if (!acc[campusId]) {
        acc[campusId] = {
          campus: result.campus,
          outcomes: {},
        };
      }

      if (!acc[campusId].outcomes[outcomeId]) {
        acc[campusId].outcomes[outcomeId] = {
          outcome: result.outcome,
          results: [],
        };
      }

      acc[campusId].outcomes[outcomeId].results.push(result);
      return acc;
    }, {});

    res.status(200).json(groupedResults);
  } catch (error) {
    console.error("Error fetching assignment results:", error);
    res.status(500).json({ error: "Error fetching assignment results" });
  }
}
