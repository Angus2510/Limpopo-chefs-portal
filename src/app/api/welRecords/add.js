import dbConnect from "../../../utils/dbConnect";
import StudentWelRecord from "../../../models/StudentWelRecord";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const { studentId, welRecords } = req.body;
    let studentWelRecord = await StudentWelRecord.findOne({
      student: studentId,
    });

    if (!studentWelRecord) {
      studentWelRecord = new StudentWelRecord({
        student: studentId,
        welRecords: welRecords,
      });
    } else {
      // Replace the welRecords array with the new records
      studentWelRecord.welRecords = welRecords;
    }

    await studentWelRecord.save();
    res
      .status(200)
      .json({ message: "W.E.L record added successfully", studentWelRecord });
  } catch (error) {
    console.error("Error adding W.E.L record:", error);
    res.status(500).json({ message: "Error adding W.E.L record" });
  }
});

export default handler;
