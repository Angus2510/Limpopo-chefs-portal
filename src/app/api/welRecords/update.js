import dbConnect from "../../../utils/dbConnect";
import Wel from "../../../models/Wel";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.patch(async (req, res) => {
  await dbConnect();

  try {
    const { id } = req.query;
    const { welRecords } = req.body;
    const wel = await Wel.findById(id);

    if (!wel) {
      return res.status(404).json({ message: "W.E.L record not found" });
    }

    wel.welRecords = welRecords;
    await wel.save();

    res.status(200).json({ message: "W.E.L record updated successfully", wel });
  } catch (error) {
    console.error("Error updating W.E.L record:", error);
    res.status(500).json({ message: "Error updating W.E.L record" });
  }
});

export default handler;
