import dbConnect from "../../../utils/dbConnect";
import Finance from "../../../models/Finance";
import Student from "../../../models/Student";
import addNotification from "../../../middleware/notificationMiddleware";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    const { studentId, collectedFee } = req.body;
    let finance = await Finance.findOne({ student: studentId });

    if (finance) {
      finance.collectedFees.push(collectedFee);
    } else {
      finance = new Finance({
        student: studentId,
        collectedFees: [collectedFee],
      });
    }

    await finance.save();

    // Add notification logic if needed
    await addNotification({
      userId: studentId,
      message: `A fee of ${collectedFee} has been collected.`,
    });

    res.status(200).json({ message: "Fee collected successfully", finance });
  } catch (error) {
    console.error("Error collecting fees:", error);
    res.status(500).json({ error: "Error collecting fees" });
  }
}
