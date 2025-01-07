import dbConnect from "../../../utils/dbConnect";
import Finance from "../../../models/Finance";
import Student from "../../../models/Student";
import AssignmentResult from "../../../models/AssignmentResults";
import Assignment from "../../../models/Assignment";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    // Find all finance records
    const financeRecords = await Finance.find().populate({
      path: "student",
      populate: ["campus", "intakeGroup"],
    });

    // Map the finance records to the required details
    const arrearsDetails = financeRecords
      .map((record) => {
        const student = record.student;
        return {
          studentId: student._id,
          studentName: `${student.profile.firstName} ${student.profile.lastName}`,
          campus: student.campus.map((c) => c.title).join(", "),
          intakeGroup: student.intakeGroup.map((ig) => ig.title).join(", "),
          arrearsAmount: record.arrearsAmount,
        };
      })
      .filter((record) => record.arrearsAmount > 0);

    res.status(200).json(arrearsDetails);
  } catch (error) {
    console.error("Error fetching accounts in arrears:", error);
    res.status(500).json({ error: "Error fetching accounts in arrears" });
  }
}
