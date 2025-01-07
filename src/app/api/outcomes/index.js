import dbConnect from "../../../utils/dbConnect";
import Outcome from "../../../models/Outcome";
import IntakeGroup from "../../../models/IntakeGroup";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const outcomes = await Outcome.find({
      $or: [{ hidden: false }, { hidden: { $exists: false } }],
    }).lean();

    if (!outcomes.length) {
      return res.status(400).json({ message: "No visible outcomes found" });
    }

    // Fetch intake groups for each outcome and add them to the outcome
    const outcomesWithIntakeGroups = await Promise.all(
      outcomes.map(async (outcome) => {
        const intakeGroups = await IntakeGroup.find({
          outcome: outcome._id,
        }).lean();
        return { ...outcome, intakeGroups };
      })
    );

    res.status(200).json(outcomesWithIntakeGroups);
  } catch (error) {
    console.error("Error fetching outcomes:", error);
    res.status(500).json({ error: "Error fetching outcomes" });
  }
}
