import dbConnect from "../../../utils/dbConnect";
import IntakeGroup from "../../../models/IntakeGroup";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const intakeGroups = await IntakeGroup.find()
      .populate("campus", "title")
      .populate("outcome", "title")
      .lean();

    if (!intakeGroups?.length) {
      return res.status(400).json({ message: "No intake groups found" });
    }

    // Fetch students for each intake group and add them to the intake group data
    const intakeGroupsWithStudents = await Promise.all(
      intakeGroups.map(async (intakeGroup) => {
        const students = await Student.find({
          intakeGroup: intakeGroup._id,
        }).lean();
        return { ...intakeGroup, students };
      })
    );

    res.status(200).json(intakeGroupsWithStudents);
  } catch (error) {
    console.error("Error fetching intake groups:", error);
    res.status(500).json({ error: "Error fetching intake groups" });
  }
}
