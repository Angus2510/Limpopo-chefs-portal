import dbConnect from "../../../utils/dbConnect";
import Student from "../../../models/Student";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.patch(async (req, res) => {
  await dbConnect();

  try {
    const studentId = req.query.id;
    const updateData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }

    res.status(200).send(updatedStudent);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default handler;
