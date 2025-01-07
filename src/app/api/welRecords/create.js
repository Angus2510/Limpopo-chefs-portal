import dbConnect from "../../../utils/dbConnect";
import Wel from "../../../models/Wel";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const { studentId, welRecords } = req.body;
    const wel = new Wel({ student: studentId, welRecords });

    await wel.save();
    res.status(201).json({ message: "W.E.L record created successfully", wel });
  } catch (error) {
    console.error("Error creating W.E.L record:", error);
    res.status(500).json({ message: "Error creating W.E.L record" });
  }
});

export default handler;
